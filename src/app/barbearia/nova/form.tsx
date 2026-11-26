"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Button, Spinner } from "@/components/Button";
import { Field } from "@/components/Field";
import { PrecosEditor } from "@/components/PrecosEditor";
import { createClient } from "@/lib/supabase/client";
import {
  limparSlug, mascaraTelefone, slugify, soDigitos,
  validarNome, validarSlugFormato, validarTelefone, type Estado,
} from "@/lib/validate";
import { criarBarbearia } from "./actions";

export default function FormBarbearia() {
  const [state, action, pending] = useActionState(criarBarbearia, {});
  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false); // se a pessoa editou, paramos de sincronizar
  const [wpp, setWpp] = useState("");
  const [disp, setDisp] = useState<"idle" | "checando" | "livre" | "ocupado" | "falhou">("idle");
  const reqId = useRef(0);

  // Nome -> endereço do link (automático até a pessoa mexer no endereço)
  function aoDigitarNome(v: string) {
    setNome(v);
    if (!slugManual) setSlug(slugify(v));
  }

  // Disponibilidade do endereço, com espera de 400 ms depois de parar de digitar
  const formatoSlug = validarSlugFormato(slug);
  useEffect(() => {
    if (formatoSlug.nivel !== "ok") return;
    const id = ++reqId.current;
    const t = setTimeout(async () => {
      setDisp("checando");
      const { data, error } = await createClient().rpc("barbearia_publica", { p_slug: slug });
      if (id !== reqId.current) return; // chegou resposta velha
      if (error) return setDisp("falhou");
      setDisp(data && data.length > 0 ? "ocupado" : "livre");
    }, 400);
    return () => clearTimeout(t);
  }, [slug, formatoSlug.nivel]);

  const vNome = validarNome(nome);
  const vWpp = validarTelefone(wpp);

  let vSlug: Estado = formatoSlug;
  if (formatoSlug.nivel === "ok") {
    vSlug =
      disp === "checando" || disp === "idle"
        ? { nivel: "dica", msg: "Verificando se está disponível…" }
        : disp === "falhou"
          ? { nivel: "dica", msg: "Não deu para verificar agora. Confirmamos ao criar." }
          : disp === "ocupado"
          ? { nivel: "erro", msg: "Esse endereço já está em uso. Tente outro, como " + slug + "-sp" }
          : { nivel: "ok", msg: "Disponível!" };
  }

  const pronto =
    vNome.nivel === "ok" && vWpp.nivel === "ok" && formatoSlug.nivel === "ok" && disp !== "ocupado";
  const faltando = [
    vNome.nivel !== "ok" && "o nome",
    formatoSlug.nivel !== "ok" && "o endereço do link",
    vWpp.nivel !== "ok" && "o WhatsApp",
  ].filter(Boolean) as string[];

  return (
    <main className="mx-auto flex w-full max-w-[448px] flex-1 flex-col gap-8 px-4 pb-12 pt-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-h1">Sua barbearia</h1>
        <p className="text-body text-text-2">Só o básico para começar. Você muda tudo depois.</p>
      </div>

      <form action={action} noValidate className="flex flex-col gap-6">
        <Field id="name" name="name" label="Nome da barbearia" placeholder="Barbearia do Zé" autoComplete="organization"
          maxLength={80} value={nome} onChange={aoDigitarNome} estado={vNome} />

        <Field id="slug" name="slug" label="Endereço do seu link" placeholder="barbearia-do-ze" autoCapitalize="none"
          autoCorrect="off" spellCheck={false} value={slug} estado={vSlug}
          prefixo="navaja.app/b/"
          sufixo={disp === "checando" && formatoSlug.nivel === "ok" ? <Spinner /> : undefined}
          ajuda={slug ? `Seu QR vai abrir navaja.app/b/${slug}/nevou` : "Criamos a partir do nome. Você pode editar."}
          onChange={(v) => { setSlugManual(true); setDisp("idle"); setSlug(limparSlug(v)); }} />

        <Field id="whatsapp" name="whatsapp" label="Seu WhatsApp" type="tel" inputMode="tel" autoComplete="tel-national"
          placeholder="(17) 99999-8888" value={wpp} onChange={(v) => setWpp(mascaraTelefone(v))} estado={vWpp}
          ajuda={'É para onde o cliente manda "Quero esse!".'} />
        <input type="hidden" name="whatsapp" value={soDigitos(wpp)} />

<div className="flex flex-col gap-2">
          <h2 className="text-h4">Preço dos cortes <span className="font-normal text-text-off">(opcional)</span></h2>
          <p className="text-caption text-text-2">Aparecem para o cliente na simulação. Você muda quando quiser em &quot;Preços&quot;.</p>
          <div className="mt-2"><PrecosEditor /></div>
        </div>

        {state.erro && (
          <p role="alert" className="rounded-sm border border-error-line bg-error-bg p-4 text-body-sm text-error">{state.erro}</p>
        )}

        <div className="flex flex-col gap-2">
          <Button type="submit" loading={pending} disabled={!pronto}>Criar barbearia</Button>
          {!pronto && faltando.length > 0 && (
            <p className="text-center text-caption text-text-2">Falta preencher: {faltando.join(", ")}.</p>
          )}
        </div>
      </form>
    </main>
  );
}
