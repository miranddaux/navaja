import Link from "next/link";
import type { ReactNode } from "react";

// Pílula de filtro (Figma: tag-day): 32px, ativa em caramelo, inativa em surface.
export function Pill({ href, ativo, children }: { href: string; ativo: boolean; children: ReactNode }) {
  return (
    <Link href={href} aria-current={ativo ? "page" : undefined}
      className={`flex h-8 shrink-0 items-center rounded-full px-4 text-caption transition ${ativo ? "border border-brand-pressed bg-brand text-bg" : "bg-surface text-text-2 hover:text-text"}`}>
      {children}
    </Link>
  );
}
