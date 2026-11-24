import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ESTILOS } from "@/lib/catalog";
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
  const { data: { user } } = await supabase.auth.getUser();

  // Barbeiro novo precisa cadastrar a barbearia antes.
  const { data: barbearia } = await supabase
    .from("barbershops")
    .select("name, credit_wallets(balance, quota)")
    .maybeSingle();
  if (!barbearia) redirect("/barbearia/nova");
  const w = Array.isArray(barbearia.credit_wallets) ? barbearia.credit_wallets[0] : barbearia.credit_wallets;

  return (
    <main className="mx-auto flex w-full max-w-[430px] flex-1 flex-col gap-6 px-4 pb-8 pt-8">
      <header className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-h2">{barbearia.name}</h1>
          {w && (
            <p className="text-body-sm text-text-2">
              <span className="text-brand">{w.quota - w.balance} de {w.quota}</span> provas usadas este mês
            </p>
          )}
        </div>
        <Link href="/painel" className="shrink-0 rounded-md border border-line bg-surface px-4 py-2 text-label text-text transition hover:bg-surface-3">
          Painel
        </Link>
      </header>

      <section aria-labelledby="catalogo" className="flex flex-col gap-4">
        <div>
          <h2 id="catalogo" className="text-h3">Catálogo</h2>
          <p className="text-body-sm text-text-2">Escolha um estilo para a prova virtual.</p>
        </div>

        <nav aria-label="Categorias" className="flex gap-2">
          {ABAS.map((t) => (
            <Link
              key={t.k}
              href={t.href}
              aria-current={categoria === t.k ? "page" : undefined}
              className={`flex h-8 items-center rounded-full border px-4 text-label transition ${
                categoria === t.k
                  ? "border-brand-pressed bg-brand text-bg"
                  : "border-line bg-surface text-text-2 hover:text-text"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <ul className="grid grid-cols-2 gap-2">
          {estilos.map((e) => (
            <li key={e.id} className="overflow-hidden rounded-md border border-line bg-surface">
              <div className="aspect-[176/160]" style={{ background: `linear-gradient(160deg, ${e.tom}, #1c1c1c)` }} aria-hidden />
              <div className="flex flex-col gap-1 p-4">
                <p className="text-h4">{e.nome}</p>
                <p className="text-caption text-text-2">{e.descricao}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <form action="/auth/signout" method="post" className="mt-auto flex items-center justify-between border-t border-line pt-4">
        <span className="truncate text-caption text-text-2">{user?.email}</span>
        <button className="text-body-sm text-text-2 underline-offset-4 hover:text-text hover:underline">Sair</button>
      </form>
    </main>
  );
}
