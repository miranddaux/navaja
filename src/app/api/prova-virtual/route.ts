import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ESTILOS } from "@/lib/catalog";
import { gerarImagem, hashEntrada } from "@/lib/ai";

const MAX_BASE64 = 6_000_000; // ~4,5 MB de foto
const TIPOS = ["image/jpeg", "image/png", "image/webp"];

// Mensagens amigáveis para os erros lançados pelo banco.
const ERROS: Record<string, [number, string]> = {
  nao_logado: [401, "Entre na sua conta para continuar."],
  sem_permissao: [403, "Você não tem acesso a esta barbearia."],
  muito_rapido: [429, "Aguarde 10 segundos antes de gerar outra."],
  teto_diario: [503, "Limite diário de simulações atingido. Tente amanhã."],
  sem_saldo: [402, "Seus créditos acabaram."],
};

export async function POST(request: Request) {
  const supabase = await createClient();

  // 1. Login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ erro: ERROS.nao_logado[1] }, { status: 401 });

  // 2. Entrada válida
  const body = await request.json().catch(() => null);
  const estilo = ESTILOS.find((e) => e.id === body?.styleId);
  const imagem: unknown = body?.imagem;
  const mime: unknown = body?.mimeType;
  if (!estilo || typeof imagem !== "string" || typeof mime !== "string" || !TIPOS.includes(mime) || imagem.length > MAX_BASE64) {
    return NextResponse.json({ erro: "Foto ou estilo inválido." }, { status: 400 });
  }

  const { data: barbearia } = await supabase.from("barbershops").select("id").maybeSingle();
  if (!barbearia) return NextResponse.json({ erro: "Cadastre sua barbearia primeiro." }, { status: 400 });

  // 3. Saldo + trava de 10 s + teto diário + desconta 1 crédito (tudo atômico no banco)
  const hash = hashEntrada(imagem, estilo.id);
  const { data: geracaoId, error } = await supabase.rpc("iniciar_geracao", {
    p_barbershop: barbearia.id,
    p_style: estilo.id,
    p_hash: hash,
  });
  if (error) {
    const [status, msg] = ERROS[error.message] ?? [500, "Não foi possível iniciar a simulação."];
    return NextResponse.json({ erro: msg }, { status });
  }

  // 4. Gera. Se falhar, devolve o crédito.
  try {
    const out = await gerarImagem({ imagemBase64: imagem, mimeType: mime, estiloNome: estilo.nome });
    await supabase.rpc("concluir_geracao", { p_id: geracaoId, p_ok: true, p_path: null });
    // A foto original nunca é gravada; o resultado vai direto para o celular.
    return NextResponse.json({
      imagem: `data:${out.mimeType};base64,${out.base64}`,
      rotulo: "simulação",
    });
  } catch (e) {
    await supabase.rpc("concluir_geracao", { p_id: geracaoId, p_ok: false });
    console.error("prova-virtual falhou:", e instanceof Error ? e.message : e);
    return NextResponse.json(
      { erro: "Não conseguimos gerar agora. Seu crédito foi devolvido." },
      { status: 502 },
    );
  }
}
