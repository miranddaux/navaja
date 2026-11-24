"use client";

import { Button, ButtonLink } from "@/components/Button";

// Se algo quebrar, a pessoa entende o que houve e sabe o que fazer (heurística 9).
export default function Erro({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-[448px] flex-1 flex-col justify-center gap-6 px-4 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-h2">Algo deu errado</h1>
        <p className="text-body-sm text-text-2">Não foi culpa sua. Tente de novo; se continuar, volte em alguns minutos.</p>
      </div>
      <div className="flex flex-col gap-2">
        <Button onClick={reset}>Tentar de novo</Button>
        <ButtonLink href="/" variant="ghost">Ir para o início</ButtonLink>
      </div>
    </main>
  );
}
