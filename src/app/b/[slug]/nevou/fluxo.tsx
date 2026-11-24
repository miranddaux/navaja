"use client";

import { useState } from "react";
import { ESTILOS } from "@/lib/catalog";

const estilos = ESTILOS.filter((e) => e.categoria === "fim-de-ano");

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

export default function FluxoNevou(p: { slug: string; nome: string; preco: number | null; whatsapp: string | null }) {
  const [nome, setNome] = useState("");
  const [wpp, setWpp] = useState("");
  const [consent, setConsent] = useState(false);
  const [estiloId, setEstiloId] = useState(estilos[0].id);
  const [foto, setFoto] = useState<File | null>(null);
  const [estado, setEstado] = useState<"form" | "gerando" | "pronto">("form");
  const [erro, setErro] = useState("");
  const [resultado, setResultado] = useState<{ id: string; imagem: string } | null>(null);

  const estilo = estilos.find((e) => e.id === estiloId)!;
  const preco = p.preco != null ? `R$ ${p.preco.toFixed(2).replace(".", ",")}` : null;

  const linkWpp = () => {
    const msg = `Oi! Vi o ${estilo.nome} na simulação da ${p.nome} e quero esse! Sou ${nome || "cliente"}.`;
    return `https://wa.me/${p.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  async function gerar(e: React.FormEvent) {
    e.preventDefault();
    if (!foto) return setErro("Tire uma selfie ou escolha uma foto.");
    setErro("");
    setEstado("gerando");
    try {
      const imagem = await reduzir(foto);
      const res = await fetch("/api/b/prova", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: p.slug, nome, whatsapp: wpp, consentimento: consent, styleId: estiloId, imagem, mimeType: "image/jpeg" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.erro);
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

  async function compartilhar() {
    if (!resultado) return;
    const blob = await (await fetch(resultado.imagem)).blob();
    const file = new File([blob], "nevou.png", { type: blob.type });
    if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text: `Vou nevar no Réveillon! ${p.nome}` });
    else salvar();
  }

  function salvar() {
    if (!resultado) return;
    const a = document.createElement("a");
    a.href = resultado.imagem;
    a.download = "nevou.png";
    a.click();
  }

  const campo = "h-12 w-full rounded-xl border border-border bg-surface px-4 outline-none placeholder:text-muted focus:border-accent";

  if (estado === "pronto" && resultado) {
    return (
      <main className="mx-auto w-full max-w-md flex-1 px-6 py-8">
        <h1 className="text-2xl font-semibold">Vou nevar no Réveillon?</h1>
        <div className="relative mt-4 overflow-hidden rounded-2xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resultado.imagem} alt={`Simulação: ${estilo.nome}`} className="w-full" />
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs">simulação</span>
          <span className="absolute bottom-3 left-3 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-fg">{p.nome}</span>
        </div>
        <p className="mt-4 text-lg font-medium">{estilo.nome}{preco && <span className="text-accent"> · {preco}</span>}</p>
        <div className="mt-4 space-y-3">
          {p.whatsapp && <button onClick={quero} className="h-12 w-full rounded-xl bg-accent font-medium text-accent-fg hover:brightness-110">Quero esse!</button>}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={compartilhar} className="h-12 rounded-xl border border-border bg-surface hover:bg-surface-2">Compartilhar</button>
            <button onClick={salvar} className="h-12 rounded-xl border border-border bg-surface hover:bg-surface-2">Salvar</button>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted">Imagem gerada por IA, só uma simulação. O resultado real pode variar. Sua foto original não fica guardada.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 py-8">
      <p className="text-sm text-accent">{p.nome}</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Vai nevar? Veja antes!</h1>
      <p className="mt-2 text-sm text-muted">Escolha o estilo e veja como fica em você.</p>

      <form onSubmit={gerar} className="mt-6 space-y-4">
        <fieldset>
          <legend className="mb-2 text-sm text-muted">Estilo</legend>
          <div className="grid grid-cols-2 gap-2">
            {estilos.map((e) => (
              <button type="button" key={e.id} onClick={() => setEstiloId(e.id)} aria-pressed={e.id === estiloId}
                className={`rounded-xl border px-3 py-3 text-left text-sm transition ${e.id === estiloId ? "border-accent bg-surface-2" : "border-border bg-surface text-muted"}`}>
                {e.nome}
              </button>
            ))}
          </div>
        </fieldset>
        {preco && <p className="text-sm text-muted">Nevou por <span className="text-accent">{preco}</span></p>}

        <input className={campo} placeholder="Seu nome" required minLength={2} value={nome} onChange={(e) => setNome(e.target.value)} />
        <input className={campo} placeholder="Seu WhatsApp com DDD" required inputMode="tel" value={wpp} onChange={(e) => setWpp(e.target.value)} />

        <label className="block text-sm text-muted">
          Selfie (de frente, com boa luz)
          <input type="file" accept="image/*" capture="user" onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm file:mr-3 file:h-10 file:rounded-lg file:border-0 file:bg-surface-2 file:px-4 file:text-foreground" />
        </label>

        <label className="flex items-start gap-3 text-xs text-muted">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--accent)]" required />
          <span>Autorizo usar minha foto só para gerar esta simulação. Ela é apagada logo após gerar. Guardamos meu nome e WhatsApp para a barbearia falar comigo.</span>
        </label>

        {erro && <p role="alert" className="text-sm text-red-400">{erro}</p>}
        <button disabled={estado === "gerando"} className="h-12 w-full rounded-xl bg-accent font-medium text-accent-fg hover:brightness-110 disabled:opacity-60">
          {estado === "gerando" ? "Gerando… (até 30 s)" : "Ver em mim"}
        </button>
        {p.whatsapp && (
          <a href={linkWpp()} target="_blank" rel="noreferrer" className="block text-center text-sm text-muted underline underline-offset-4">
            Prefiro sem foto: chamar a barbearia
          </a>
        )}
      </form>
    </main>
  );
}
