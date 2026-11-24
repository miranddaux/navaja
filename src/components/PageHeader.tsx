import Link from "next/link";
import type { ReactNode } from "react";

// Cabeçalho do Figma: botão "return" circular (44) + título h2.
export function PageHeader({ titulo, voltar, acao }: { titulo: string; voltar?: string; acao?: ReactNode }) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-4">
        {voltar && (
          <Link
            href={voltar}
            aria-label="Voltar"
            className="flex size-[44px] shrink-0 items-center justify-center rounded-full border border-line bg-surface text-text transition hover:bg-surface-3 active:scale-95"
          >
            <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5m0 0l6-6m-6 6l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}
        <h1 className="truncate text-h2">{titulo}</h1>
      </div>
      {acao}
    </header>
  );
}
