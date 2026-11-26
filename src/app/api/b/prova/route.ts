import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ESTILOS } from "@/lib/catalog";
import { gerarImagem, hashEntrada } from "@/lib/ai";

// Rota PÚBLICA (cliente do QR, sem login). As travas ficam no banco.
const MAX_BASE64 = 6_000_000;
const TIPOS = ["image/jpeg", "image/png", "image/webp"];

const ERROS: Record<string, [number, string]> = {
  sem_consentimento: [400, "Precisamos do seu consentimento para usar a foto."],
  whatsapp_invalido: [400, "Confira o WhatsApp (com DDD)."],
  nome_invalido: [400, "Digite seu nome."],
  barbearia_nao_encontrada: [404, "Barbearia não encontrada."],
  whatsapp_ja_usou: [409, "Esse WhatsApp já fez uma simulação. Fale com a barbearia!"],
  limite_barbearia: [429, "As simulações de hoje desta barbearia acabaram. Volte amanhã!"],
  teto_diario: [503, "Muita gente usando hoje. Tente amanhã."],
  sem_saldo: [503, "As simulações desta barbearia acabaram por agora."],
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const estilo = ESTILOS.find((e) => e.id === body?.styleId);
  const { slug, nome, whatsapp, consentimento, imagem, mimeType } = body ?? {};
  if (
    !estilo || typeof slug !== "string" || typeof imagem !== "string" || typeof mimeType !== "string" ||
    !TIPOS.includes(mimeType) || imagem.length > MAX_BASE64
  ) {
    return NextResponse.json({ erro: "Foto ou estilo inválido." }, { status: 400 });
  }

  const supabase = await createClient();
  await supabase.rpc("liberar_pendentes"); // devolve créditos de gerações interrompidas
  const { data: id, error } = await supabase.rpc("iniciar_geracao_qr", {
    p_slug: slug,
    p_style: estilo.id,
    p_hash: hashEntrada(imagem, estilo.id),
    p_nome: String(nome ?? ""),
    p_whatsapp: String(whatsapp ?? ""),
    p_consent: consentimento === true,
  });
  if (error) {
    const [status, msg] = ERROS[error.message] ?? [500, "Não foi possível iniciar a simulação."];
    return NextResponse.json({ erro: msg }, { status });
  }

  try {
    const out = await gerarImagem({ imagemBase64: imagem, mimeType, estiloNome: estilo.nome, estiloId: estilo.id });
    await supabase.rpc("concluir_geracao_qr", { p_id: id, p_ok: true });
    return NextResponse.json({ id, imagem: `data:${out.mimeType};base64,${out.base64}`, rotulo: "simulação" });
  } catch (e) {
    await supabase.rpc("concluir_geracao_qr", { p_id: id, p_ok: false });
    console.error("prova QR falhou:", e instanceof Error ? e.message : e);
    return NextResponse.json(
      { erro: "Não conseguimos gerar agora. Tente de novo em instantes.", codigo: e instanceof Error ? e.message : "desconhecido" },
      { status: 502 },
    );
  }
}

// "Quero esse!" — avisa o painel do barbeiro.
export async function PUT(request: Request) {
  const body = await request.json().catch(() => null);
  if (typeof body?.id !== "string") return NextResponse.json({}, { status: 400 });
  const supabase = await createClient();
  await supabase.rpc("marcar_interesse", { p_id: body.id });
  return NextResponse.json({ ok: true });
}
