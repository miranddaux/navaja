"use client";

import { useTransition } from "react";
import { Button } from "@/components/Button";
import { PrecosEditor } from "@/components/PrecosEditor";
import { useToast } from "@/components/Toast";
import type { Precos } from "@/lib/precos";
import { salvarPrecos } from "./actions";

export default function FormPrecos({ inicial }: { inicial: Precos }) {
  const [salvando, iniciar] = useTransition();
  const toast = useToast();

  function aoEnviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    iniciar(async () => {
      const r = await salvarPrecos(fd);
      if (r.ok) toast("Preços salvos!");
      else toast(r.erro ?? "Não foi possível salvar.", "erro");
    });
  }

  return (
    <form onSubmit={aoEnviar} className="flex flex-col gap-8">
      <PrecosEditor inicial={inicial} />
      <div className="md:max-w-[448px]"><Button type="submit" loading={salvando} className="w-full">Salvar preços</Button></div>
    </form>
  );
}
