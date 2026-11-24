import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ESTILOS } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Fim de Ano · Navaja" };

// A página lê cookies (login) e a URL (aba), então vai dentro de <Suspense>.
export default function FimDeAnoPage(props: PageProps<"/fim-de-ano">) {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <Catalogo searchParams={props.searchParams} />
    </Suspense>
  );
}

async function Catalogo({
  searchParams,
}: {
  searchParams: PageProps<"/fim-de-ano">["searchParams"];
}) {
  const { aba } = await searchParams;
  const categoria = aba === "cortes" ? "cortes" : "fim-de-ano";
  const estilos = ESTILOS.filter((e) => e.categoria === categoria);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Barbeiro novo precisa cadastrar a barbearia antes.
  const { data: barbearia } = await supabase
    .from("barbershops")
    .select("name, credit_wallets(balance, quota)")
    .maybeSingle();
  if (!barbearia) redirect("/barbearia/nova");
  const carteira = Array.isArray(barbearia.credit_wallets) ? barbearia.credit_wallets[0] : barbearia.credit_wallets;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">
          Nav<span className="text-accent">aja</span>
        </h1>
        <form action="/auth/signout" method="post" className="flex items-center gap-3">
          <Link href="/painel" className="text-sm text-accent underline-offset-4 hover:underline">Painel</Link>
          <span className="hidden text-xs text-muted sm:inline">{user?.email}</span>
          <button className="text-sm text-muted underline-offset-4 hover:text-foreground hover:underline">
            Sair
          </button>
        </form>
      </header>

      <p className="mb-4 text-sm text-muted">
        {barbearia.name}
        {carteira && <> · <span className="text-accent">{carteira.quota - carteira.balance} de {carteira.quota} usadas</span></>}
      </p>
      <h2 className="text-2xl font-semibold">Catálogo</h2>
      <p className="mt-1 text-sm text-muted">Escolha um estilo para a prova virtual.</p>

      <nav className="mt-6 flex gap-2" aria-label="Categorias">
        {[
          { k: "fim-de-ano", label: "Fim de Ano", href: "/fim-de-ano" },
          { k: "cortes", label: "Cortes", href: "/fim-de-ano?aba=cortes" },
        ].map((t) => (
          <Link
            key={t.k}
            href={t.href}
            aria-current={categoria === t.k ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm transition ${
              categoria === t.k
                ? "bg-accent font-medium text-accent-fg"
                : "border border-border bg-surface text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {estilos.map((e) => (
          <li key={e.id} className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="aspect-[4/5]" style={{ background: `linear-gradient(160deg, ${e.tom}, #181614)` }} aria-hidden />
            <div className="p-4">
              <p className="font-medium">{e.nome}</p>
              <p className="mt-1 text-xs text-muted">{e.descricao}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
