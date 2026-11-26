"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { FormatoRostoIcone } from "@/components/FormatoRostoIcone";
import { FotoEstilo } from "@/components/FotoEstilo";
import { ESTILOS, FORMATOS, SUGESTOES, type FormatoRosto } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/client";
import { mascaraTelefone, soDigitos, validarNome, validarTelefone } from "@/lib/validate";

const ERROS: Record<string, string> = {
  limite_barbearia: "Muita gente usando hoje. Tente amanhã.",
  barbearia_nao_encontrada: "Barbearia não encontrada.",
};

// Caminho sem foto (LGPD): escolhe o formato do rosto, vê sugestões e deixa o contato.
export default function SemFoto(p: { slug: string; nome: string; preco: number | null; whatsapp: string | null; onVoltar: () => void }) {
  const [formato, setFormato] = useState<FormatoRosto | null>(null);
  const [nome, setNome] = useState("");
  const [wpp, setWpp] = useState("");
  const [consent, setConsent] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [vendo, setVendo] = useState(false);
  const [enviado, setEnviado] = useState<string | null>(null);

  const vNome = validarNome(nome);
  const vWpp = validarTelefone(wpp);
  const pronto = !!formato && vNome.nivel === "ok" && vWpp.nivel === "ok" && consent;
  const faltando = [!formato && "formato do rosto", vNome.nivel !== "ok" && "nome", vWpp.nivel !== "ok" && "WhatsApp", !consent && "autorização"].filter(Boolean) as string[];
  const preco = p.preco != null ? `R$ ${p.preco.toFixed(2).replace(".", ",")}` : null;

  async function registrar(styleId: string) {
    const { data, error } = await createClient().rpc("registrar_interessado", {
      p_slug: p.slug, p_nome: nome, p_whatsapp: soDigitos(wpp), p_formato: formato!, p_style: styleId, p_consent: consent,
    });
    if (error) throw new Error(ERROS[error.message] ?? "Não foi possível continuar. Tente de novo.");
    return data as string;
  }

  async function verSugestoes(e: React.FormEvent) {
    e.preventDefault();
    if (!pronto) return;
    setErro(""); setCarregando(true);
    try { await registrar(SUGESTOES[formato!][0]); setVendo(true); }
    catch (err) { setErro(err instanceof Error ? err.message : "Algo deu errado."); }
    finally { setCarregando(false); }
  }

  async function quero(styleId: string, styleNome: string) {
    setEnviado(styleId);
    try {
      const id = await registrar(styleId);
      await createClient().rpc("marcar_interesse", { p_id: id });
    } catch { /* o contato já foi salvo antes; seguimos para o WhatsApp */ }
    const msg = `Oi! Vi o ${styleNome} na ${p.nome} e quero esse! Sou ${nome}.`;
    if (p.whatsapp) window.open(`https://wa.me/${p.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  if (vendo && formato) {
    const sugestoes = SUGESTOES[formato].map((id) => ESTILOS.find((e) => e.id === id)!);
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-h3">Combinam com rosto {FORMATOS.find((f) => f.id === formato)!.nome.toLowerCase()}</h2>
          <p className="text-body-sm text-text-2">Escolha o que mais gostou e fale com a barbearia.</p>
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {sugestoes.map((e) => (
            <li key={e.id} className="flex flex-col overflow-hidden rounded-md border border-line bg-surface">
              <FotoEstilo id={e.id} tom={e.tom} className="aspect-square" />
              <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                  <p className="text-h4">{e.nome}</p>
                  {preco && <p className="text-caption text-brand">{preco}</p>}
                </div>
                <Button size="sm" loading={enviado === e.id} onClick={() => quero(e.id, e.nome)}>Quero esse!</Button>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-caption text-text-2">Sugestões pelo formato do rosto. A barbearia confirma o melhor corte na cadeira.</p>
      </div>
    );
  }

  return (
    <form onSubmit={verSugestoes} noValidate className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-h3">Sem foto, sem problema</h2>
        <p className="text-body-sm text-text-2">Escolha o formato do seu rosto e veja os estilos que mais combinam.</p>
      </div>

      <fieldset className="flex flex-col">
        <legend className="mb-4 text-h4"><span className="mr-2 text-brand">1</span>Formato do rosto</legend>
        <div className="grid grid-cols-3 gap-2">
          {FORMATOS.map((f) => (
            <button type="button" key={f.id} onClick={() => setFormato(f.id)} aria-pressed={formato === f.id}
              className={`flex min-h-[96px] flex-col items-center justify-center gap-2 rounded-md border p-2 text-caption transition active:scale-95 ${formato === f.id ? "border-brand bg-surface-3 text-text" : "border-line bg-surface text-text-2 hover:text-text"}`}>
              <FormatoRostoIcone formato={f.id} />
              {f.nome}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-4">
        <p className="text-h4"><span className="mr-2 text-brand">2</span>Seus dados</p>
        <div className="flex flex-col gap-6">
          <Field id="sf-nome" label="Seu nome" autoComplete="given-name" placeholder="Como te chamamos?" value={nome} onChange={setNome} estado={vNome} />
          <Field id="sf-wpp" label="Seu WhatsApp" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(17) 99999-8888"
            value={wpp} onChange={(v) => setWpp(mascaraTelefone(v))} estado={vWpp} ajuda="A barbearia fala com você por aqui." />
        </div>
        <label className="flex items-start gap-4 rounded-md border border-line bg-surface p-4 text-caption text-text-2">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[#c4894a]" />
          <span>Autorizo a barbearia a guardar meu nome e WhatsApp para falar comigo sobre este estilo.</span>
        </label>
      </div>

      {erro && <p role="alert" className="rounded-sm border border-error-line bg-error-bg p-4 text-body-sm text-error">{erro}</p>}

      <div className="flex flex-col gap-2">
        <Button type="submit" loading={carregando} disabled={!pronto}>Ver sugestões</Button>
        {!pronto && <p className="text-center text-caption text-text-2">Falta: {faltando.join(", ")}.</p>}
        <Button type="button" variant="ghost" onClick={p.onVoltar}>Voltar e enviar uma selfie</Button>
      </div>
    </form>
  );
}
