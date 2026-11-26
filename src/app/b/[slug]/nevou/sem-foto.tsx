"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { CardEstilo } from "@/components/CardEstilo";
import { CardRosto } from "@/components/CardRosto";
import { FORMATOS, sugestoesComFoto, type FormatoRosto } from "@/lib/catalog";
import { brl } from "@/lib/precos";
import { waLink } from "@/lib/whatsapp";
import { createClient } from "@/lib/supabase/client";
import { mascaraTelefone, soDigitos, validarNome, validarTelefone } from "@/lib/validate";

const ERROS: Record<string, string> = {
  limite_barbearia: "Muita gente usando hoje. Tente amanhã.",
  barbearia_nao_encontrada: "Barbearia não encontrada.",
};

// Caminho sem foto (LGPD): escolhe o formato do rosto, vê sugestões e deixa o contato.
export default function SemFoto(p: { slug: string; nome: string; precos: Record<string, number>; whatsapp: string | null; onVoltar: () => void }) {
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
    try { await registrar(sugestoesComFoto(formato!)[0].id); setVendo(true); }
    catch (err) { setErro(err instanceof Error ? err.message : "Algo deu errado."); }
    finally { setCarregando(false); }
  }

  // Abre o WhatsApp NA HORA do toque (navegadores de celular bloqueiam janelas abertas depois de esperar a rede);
  // o registro do interesse segue em segundo plano.
  function quero(styleId: string, styleNome: string) {
    setEnviado(styleId);
    registrar(styleId)
      .then((id) => createClient().rpc("marcar_interesse", { p_id: id }))
      .catch(() => { /* o contato já foi salvo antes; o cliente segue para o WhatsApp */ })
      .finally(() => setEnviado(null));
    const msg = `Oi! Vi o ${styleNome} na ${p.nome} e quero esse! Sou ${nome}.`;
    if (p.whatsapp) window.open(waLink(p.whatsapp, msg), "_blank");
  }

  if (vendo && formato) {
    const sugestoes = sugestoesComFoto(formato);
    const nomeFormato = FORMATOS.find((f) => f.id === formato)!.nome.toLowerCase();
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <p className="flex w-fit items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-caption text-text-2">
            Para: <span className="text-text">{nome.trim()} · Rosto {nomeFormato}</span>
          </p>
          <div className="flex flex-col gap-2">
            <h2 className="text-h2">Sugestões pra você</h2>
            <p className="text-body text-text-2">Estes estilos combinam com rosto {nomeFormato}. Escolha um e fale com a barbearia.</p>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-2">
          {sugestoes.map((e) => (
            <CardEstilo key={e.id} id={e.id} tom={e.tom} nome={e.nome}>
              {p.precos[e.id] != null && <p className="text-h4 text-text">{brl(p.precos[e.id])}</p>}
              <Button size="sm" loading={enviado === e.id} onClick={() => quero(e.id, e.nome)} className="mt-1 w-full">Quero esse!</Button>
            </CardEstilo>
          ))}
        </ul>
        <p className="text-caption text-text-2">Sugestões pelo formato do rosto. A barbearia confirma o melhor corte na cadeira.</p>
      </div>
    );
  }

  return (
    <form onSubmit={verSugestoes} noValidate className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-h2">Sem foto, sem problema</h2>
        <p className="text-body text-text-2">Escolha o formato do seu rosto e veja os estilos que mais combinam.</p>
      </div>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-h3"><span className="mr-3 inline-flex size-6 items-center justify-center rounded-full border border-brand-pressed bg-brand-subtle align-middle text-label text-brand">1</span>Selecione o formato do rosto</legend>
        <div className="grid grid-cols-2 gap-2">
          {FORMATOS.map((f) => (
            <CardRosto key={f.id} formato={f.id} nome={f.nome} selecionado={formato === f.id} onSelecionar={() => setFormato(f.id)} />
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-4">
        <p className="text-h3"><span className="mr-3 inline-flex size-6 items-center justify-center rounded-full border border-brand-pressed bg-brand-subtle align-middle text-label text-brand">2</span>Seus dados</p>
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
        <Button type="button" variant="ghost" size="md" className="underline underline-offset-4" onClick={p.onVoltar}>Voltar e enviar uma selfie</Button>
      </div>
    </form>
  );
}
