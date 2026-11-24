import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppNav, type NavItem } from "./AppNav";

// Moldura única das telas logadas: cabeçalho, navegação e "Sair" sempre no mesmo lugar.
export async function AppChrome({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: dono } = await supabase.rpc("eh_dono");

  const itens: NavItem[] = [
    { href: "/fim-de-ano", label: "Estilos", icone: "estilos" },
    { href: "/painel", label: "Painel", icone: "painel" },
    ...(dono ? [{ href: "/dono", label: "Dono", icone: "dono" } as NavItem] : []),
  ];

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-bg">
        Pular para o conteúdo
      </a>
      <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-[1120px] items-center justify-between gap-4 px-4 md:px-8">
          <p className="text-h3">Nav<span className="text-brand">aja</span></p>
          <AppNav itens={itens} variante="topo" />
          <form action="/auth/signout" method="post" className="flex items-center gap-4">
            <span className="hidden max-w-[200px] truncate text-caption text-text-2 lg:inline">{user.email}</span>
            <button className="flex min-h-[44px] items-center px-2 text-body-sm text-text-2 transition hover:text-text">Sair</button>
          </form>
        </div>
      </header>
      <div id="conteudo" className="flex-1 pb-[calc(88px+env(safe-area-inset-bottom))] md:pb-12">{children}</div>
      <AppNav itens={itens} variante="base" />
    </div>
  );
}
