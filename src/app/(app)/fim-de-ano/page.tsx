import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ESTILOS } from "@/lib/catalog";
import { FotoEstilo } from "@/components/FotoEstilo";
import { Progress } from "@/components/Progress";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Estilos · Navaja" };

// A página lê cookies (login) e a URL (aba), então vai dentro de <Suspense>.
export default function FimDeAnoPage(props: PageProps<"/fim-de-ano">) {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <Catalogo searchParams={props.searchParams} />
    </Suspense>
  );
}

const ABAS = [
  { k: "fim-de-ano", label: "Fim de Ano", href: "/fim-de-ano" },
  { k: "cortes", label: "Cortes", href: "/fim-de-ano?aba=cortes" },
] as const;

async function Catalogo({ searchParams }: { searchParams: PageProps<"/fim-de-ano">["searchParams"] }) {
  const { aba } = await searchParams;
  const categoria = aba === "cortes" ? "cortes" : "fim-de-ano";
  const estilos = ESTILOS.filter((e) => e.categoria === categoria);

  const supabase = await createClient();
  const { data: barbearia } = await supabase
    .from("barbershops")
    .select("name, credit_wallets(balance, quota)")
    .maybeSingle();
  if (!barbearia) redirect("/barbearia/nova");
  const w = Array.isArray(barbearia.credit_wallets) ? barbearia.credit_wallets[0] : barbearia.credit_wallets;
  const usadas = w ? w.quota - w.balance : 0;

  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-10 px-4 pt-8 md:px-8 md:pt-12">
      {/* Bloco 1: quem sou eu e quanto resta (8 entre itens do mesmo grupo) */}
      <header className="flex flex-col gap-2">
        <h1 className="text-h2">{barbearia.name}</h1>
        {w && (
          <div className="flex max-w-[320px] flex-col gap-2">
            <Progress valor={usadas} max={w.quota} rotulo="Provas usadas" />
            <p className="text-body-sm text-text-2"><span className="text-brand">{usadas} de {w.quota}</span> provas usadas este mês</p>
          </div>
        )}
      </header>

      {/* Bloco 2: catálogo (16 entre título, filtros e lista) */}
      <section aria-labelledby="catalogo" className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 id="catalogo" className="text-h3">Catálogo</h2>
          <p className="text-body-sm text-text-2">Estilos disponíveis para a prova virtual.</p>
        </div>

        <nav aria-label="Categorias" className="flex gap-2">
          {ABAS.map((t) => (
            <Link key={t.k} href={t.href} aria-current={categoria === t.k ? "page" : undefined}
              className={`flex h-10 items-center rounded-full border px-4 text-label transition ${categoria === t.k ? "border-brand-pressed bg-brand text-bg" : "border-line bg-surface text-text-2 hover:text-text"}`}>
              {t.label}
            </Link>
          ))}
        </nav>

        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {estilos.map((e) => (
            <li key={e.id} className="overflow-hidden rounded-md border border-line bg-surface">
              <FotoEstilo id={e.id} tom={e.tom} className="aspect-square" />
              <div className="flex flex-col gap-1 p-4">
                <p className="text-h4">{e.nome}</p>
                <p className="text-caption text-text-2">{e.descricao}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
