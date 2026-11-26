import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ESTILOS } from "@/lib/catalog";
import { CardEstilo } from "@/components/CardEstilo";
import { CardIa } from "@/components/CardIa";
import { Pill } from "@/components/Pill";
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
    .select("name, slug, credit_wallets(balance, quota)")
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

      <div className="md:max-w-[448px]"><CardIa href={`/b/${barbearia.slug}/nevou`} /></div>

      {/* Bloco 2: catálogo (16 entre título, filtros e lista) */}
      <section aria-labelledby="catalogo" className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 id="catalogo" className="text-h3">Catálogo</h2>
          <p className="text-body-sm text-text-2">Estilos disponíveis para a prova virtual.</p>
        </div>

        <nav aria-label="Categorias" className="flex gap-2">
          {ABAS.map((t) => (
            <Pill key={t.k} href={t.href} ativo={categoria === t.k}>{t.label}</Pill>
          ))}
        </nav>

        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {estilos.map((e) => (
            <CardEstilo key={e.id} id={e.id} tom={e.tom} nome={e.nome} />
          ))}
        </ul>
      </section>
    </main>
  );
}
