"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { BannerNevou } from "@/components/BannerNevou";
import { Field } from "@/components/Field";
import SemFoto from "./sem-foto";
import { ESTILOS } from "@/lib/catalog";
import { brl } from "@/lib/precos";
import { mascaraTelefone, soDigitos, validarNome, validarTelefone } from "@/lib/validate";

const estilos = ESTILOS.filter((e) => e.selfie);

// Reduz a foto para resolução de celular (máx. 1024 px) antes de enviar.
async function reduzir(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const escala = Math.min(1, 1024 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * escala);
  c.height = Math.round(bmp.height * escala);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.85).split(",")[1];
}

// Feedback enquanto a IA trabalha (visibilidade do status): etapa + tempo + barra estimada.
function ProgressoGeracao() {
  const [seg, setSeg] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSeg((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const etapa = seg < 4 ? "Enviando sua foto…" : seg < 12 ? "Aplicando o estilo…" : seg < 25 ? "Ajustando os detalhes…" : "Quase lá, obrigado por esperar…";
  const pct = Math.min(95, Math.round((seg / 30) * 100));
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-2 rounded-md border border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-body-sm">{etapa}</p>
        <p className="text-caption text-text-2">{seg}s</p>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-3">
        <div className="h-full rounded-full bg-brand transition-all duration-1000" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-caption text-text-2">Costuma levar de 10 a 30 segundos. Não feche esta tela.</p>
    </div>
  );
}

export default function FluxoNevou(p: { slug: string; nome: string; precos: Record<string, number>; whatsapp: string | null }) {
  const [nome, setNome] = useState("");
  const [wpp, setWpp] = useState("");
  const [consent, setConsent] = useState(false);
  const [estiloId, setEstiloId] = useState(estilos[0].id);
  const [foto, setFoto] = useState<File | null>(null);
  const [previa, setPrevia] = useState<string | null>(null);
  const [semFoto, setSemFoto] = useState(false);
  const [estado, setEstado] = useState<"form" | "gerando" | "pronto">("form");
  const [erro, setErro] = useState("");
  const [resultado, setResultado] = useState<{ id: string; imagem: string } | null>(null);

  function escolherFoto(file: File | null) {
    if (previa) URL.revokeObjectURL(previa);
    setFoto(file);
    setPrevia(file ? URL.createObjectURL(file) : null);
  }

  const estilo = estilos.find((e) => e.id === estiloId)!;
  const preco = p.precos[estiloId] != null ? brl(p.precos[estiloId]) : null;
  const vNome = validarNome(nome);
  const vWpp = validarTelefone(wpp);
  const pronto = vNome.nivel === "ok" && vWpp.nivel === "ok" && !!foto && consent;
  const faltando = [
    vNome.nivel !== "ok" && "nome",
    vWpp.nivel !== "ok" && "WhatsApp",
    !foto && "selfie",
    !consent && "autorização",
  ].filter(Boolean) as string[];

  const linkWpp = () => {
    const msg = `Oi! Vi o ${estilo.nome} na simulação da ${p.nome} e quero esse! Sou ${nome || "cliente"}.`;
    return `https://wa.me/${p.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  async function gerar(e: React.FormEvent) {
    e.preventDefault();
    if (!pronto || !foto) return;
    setErro("");
    setEstado("gerando");
    try {
      const imagem = await reduzir(foto);
      const res = await fetch("/api/b/prova", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: p.slug, nome, whatsapp: soDigitos(wpp), consentimento: consent, styleId: estiloId, imagem, mimeType: "image/jpeg",
        }),
      });
      // Se o servidor demorar demais, a resposta pode não ser JSON: tratamos sem mostrar erro técnico
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          json.erro
            ? json.codigo ? `${json.erro} (código: ${json.codigo})` : json.erro
            : "Demorou mais que o normal. Tente de novo; se a simulação falhou, seu crédito volta sozinho.",
        );
      }
      setResultado(json);
      setEstado("pronto");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Algo deu errado. Tente de novo.");
      setEstado("form");
    }
  }

  function quero() {
    if (resultado) fetch("/api/b/prova", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: resultado.id }) });
    window.open(linkWpp(), "_blank");
  }

  function salvar() {
    if (!resultado) return;
    const a = document.createElement("a");
    a.href = resultado.imagem;
    a.download = "nevou.png";
    a.click();
  }

  async function compartilhar() {
    if (!resultado) return;
    const blob = await (await fetch(resultado.imagem)).blob();
    const file = new File([blob], "nevou.png", { type: blob.type });
    if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text: `Vou nevar no Réveillon! ${p.nome}` });
    else salvar();
  }

  if (estado === "pronto" && resultado) {
    return (
      <main className="mx-auto flex w-full max-w-[448px] flex-1 flex-col gap-8 px-4 pb-12 pt-8">
        <h1 className="text-h1">Vou nevar no Réveillon?</h1>
        <div className="relative overflow-hidden rounded-lg border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resultado.imagem} alt={`Simulação: ${estilo.nome}`} className="w-full" />
          <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-label">simulação</span>
          <span className="absolute bottom-4 left-4 rounded-full border border-brand-pressed bg-brand px-3 py-1 text-label text-bg">{p.nome}</span>
        </div>
        <p className="text-h3">
          {estilo.nome}
          {preco && <span className="text-brand"> · {preco}</span>}
        </p>
        <div className="flex flex-col gap-2">
          {p.whatsapp && <Button onClick={quero}>Quero esse!</Button>}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" size="md" onClick={compartilhar} className="px-4">Compartilhar</Button>
            <Button variant="secondary" size="md" onClick={salvar} className="px-4">Salvar</Button>
          </div>
        </div>
        <p className="text-caption text-text-2">
          Imagem gerada por IA, só uma simulação. O resultado real pode variar. Sua foto original não fica guardada.
        </p>
      </main>
    );
  }

  if (semFoto) {
    return (
      <main className="mx-auto flex w-full max-w-[448px] flex-1 flex-col gap-8 px-4 pb-12 pt-8 sm:max-w-3xl">
        <BannerNevou nome={p.nome} />
        <SemFoto slug={p.slug} nome={p.nome} precos={p.precos} whatsapp={p.whatsapp} onVoltar={() => setSemFoto(false)} />
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-[448px] flex-1 flex-col gap-8 px-4 pb-12 pt-8">
      <BannerNevou nome={p.nome} />

      <form onSubmit={gerar} noValidate className="flex flex-col gap-8">
        <fieldset className="flex flex-col">
          <legend className="mb-4 text-h3"><span className="mr-3 inline-flex size-6 items-center justify-center rounded-full border border-brand-pressed bg-brand-subtle align-middle text-label text-brand">1</span>Escolha o estilo</legend>
          <div className="grid grid-cols-2 gap-2">
            {estilos.map((e) => (
              <button
                type="button" key={e.id} onClick={() => setEstiloId(e.id)} aria-pressed={e.id === estiloId}
                className={`flex min-h-[44px] items-center rounded-md border px-4 py-2 text-left text-body-sm transition ${
                  e.id === estiloId ? "border-brand bg-surface-3 text-text" : "border-line bg-surface text-text-2 hover:text-text"
                }`}
              >
                <span className="flex flex-col gap-1">
                  <span>{e.nome}</span>
                  {p.precos[e.id] != null && <span className="text-h4 text-text">{brl(p.precos[e.id])}</span>}
                </span>
              </button>
            ))}
          </div>
          
        </fieldset>

        <div className="flex flex-col gap-4">
          <p className="text-h3"><span className="mr-3 inline-flex size-6 items-center justify-center rounded-full border border-brand-pressed bg-brand-subtle align-middle text-label text-brand">2</span>Seus dados</p>
          <div className="flex flex-col gap-6">
          <Field id="nome" label="Seu nome" autoComplete="given-name" placeholder="Como te chamamos?" value={nome} onChange={setNome} estado={vNome} />
          <Field id="wpp" label="Seu WhatsApp" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(17) 99999-8888"
            value={wpp} onChange={(v) => setWpp(mascaraTelefone(v))} estado={vWpp} ajuda="A barbearia fala com você por aqui." />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-h3"><span className="mr-3 inline-flex size-6 items-center justify-center rounded-full border border-brand-pressed bg-brand-subtle align-middle text-label text-brand">3</span>Sua selfie</p>
          <label htmlFor="foto" className="flex min-h-[96px] cursor-pointer items-center gap-4 rounded-md border border-dashed border-line bg-surface p-4 transition hover:border-brand">
            {previa ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previa} alt="Sua selfie" className="size-16 rounded-full object-cover" />
            ) : (
              <span aria-hidden className="flex size-16 items-center justify-center rounded-full bg-surface-3 text-text-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M4 8h3l1.5-2h7L17 8h3v11H4V8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.6"/></svg>
              </span>
            )}
            <span className="flex flex-col">
              <span className="text-h4">{foto ? "Trocar foto" : "Tirar selfie"}</span>
              <span className="text-caption text-text-2">De frente, rosto inteiro e com boa luz.</span>
            </span>
            <input id="foto" type="file" accept="image/*" capture="user" className="sr-only" onChange={(e) => escolherFoto(e.target.files?.[0] ?? null)} />
          </label>

          <label className="flex items-start gap-4 rounded-md border border-line bg-surface p-4 text-caption text-text-2">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[#c4894a]" />
          <span>
            Autorizo usar minha foto só para gerar esta simulação. Ela é apagada logo após gerar. Guardamos meu nome e
            WhatsApp para a barbearia falar comigo.
          </span>
        </label>
        </div>


        {estado === "gerando" && <ProgressoGeracao />}

        {erro && <p role="alert" className="rounded-sm border border-error-line bg-error-bg p-4 text-body-sm text-error">{erro}</p>}

        <div className="flex flex-col gap-4">
          <p className="text-center text-caption text-text-2">Sua foto não fica guardada: é apagada assim que a imagem é gerada.</p>
          <Button type="submit" loading={estado === "gerando"} disabled={!pronto}>
            {estado === "gerando" ? "Gerando… até 30 segundos" : "Ver como fico"}
          </Button>
          {!pronto && estado !== "gerando" && (
            <p className="text-center text-caption text-text-2">Falta: {faltando.join(", ")}.</p>
          )}
          <Button type="button" variant="secondary" size="md" onClick={() => setSemFoto(true)}>Prefiro não enviar foto</Button>
        </div>
      </form>
    </main>
  );
}
