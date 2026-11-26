"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconDono, IconEstilos, IconPainel, IconPrecos } from "./Icons";

export type NavItem = { href: string; label: string; icone: "estilos" | "painel" | "dono" | "precos" };
const ICONES = { estilos: IconEstilos, painel: IconPainel, dono: IconDono, precos: IconPrecos };

// Mesma navegação em todo o app: barra inferior no celular, topo no computador.
export function AppNav({ itens, variante }: { itens: NavItem[]; variante: "topo" | "base" }) {
  const path = usePathname();
  const ativo = (h: string) => path === h || path.startsWith(h + "/");

  if (variante === "topo") {
    return (
      <nav aria-label="Principal" className="hidden items-center gap-2 md:flex">
        {itens.map((i) => {
          const Icone = ICONES[i.icone];
          return (
            <Link key={i.href} href={i.href} aria-current={ativo(i.href) ? "page" : undefined}
              className={`flex h-10 items-center gap-2 rounded-md px-4 text-body-sm font-medium transition ${ativo(i.href) ? "bg-surface-3 text-text" : "text-text-2 hover:text-text"}`}>
              <Icone /> {i.label}
            </Link>
          );
        })}
      </nav>
    );
  }
  return (
    <nav aria-label="Principal" className="fixed inset-x-4 bottom-[calc(16px+env(safe-area-inset-bottom))] z-20 mx-auto max-w-[359px] rounded-full border border-line bg-bg px-6 py-2 shadow-[0_8px_16px_rgba(0,0,0,0.64),0_2px_4px_rgba(0,0,0,0.4)] md:hidden print:hidden">
      <ul className="flex items-center justify-between">
        {itens.map((i) => {
          const Icone = ICONES[i.icone];
          return (
            <li key={i.href}>
              <Link href={i.href} aria-current={ativo(i.href) ? "page" : undefined}
                className={`flex min-h-[56px] min-w-[56px] flex-col items-center justify-center gap-1 text-label transition active:scale-95 ${ativo(i.href) ? "text-brand" : "text-text-2"}`}>
                <Icone /> {i.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
