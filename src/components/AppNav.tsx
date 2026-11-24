"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconDono, IconEstilos, IconPainel } from "./Icons";

export type NavItem = { href: string; label: string; icone: "estilos" | "painel" | "dono" };
const ICONES = { estilos: IconEstilos, painel: IconPainel, dono: IconDono };

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
    <nav aria-label="Principal" className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden print:hidden">
      <ul className="mx-auto flex max-w-[430px]">
        {itens.map((i) => {
          const Icone = ICONES[i.icone];
          return (
            <li key={i.href} className="flex-1">
              <Link href={i.href} aria-current={ativo(i.href) ? "page" : undefined}
                className={`flex min-h-[56px] flex-col items-center justify-center gap-1 text-caption transition active:scale-95 ${ativo(i.href) ? "text-brand" : "text-text-2"}`}>
                <Icone /> {i.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
