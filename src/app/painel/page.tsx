import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ESTILOS } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Painel · Navaja" };

export default function PainelPage() {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <Painel />
    </Suspense>
  );
}

async function Painel() {
  const supabase = await createClient();
  const { data: b } = await supabase
    .from("barbershops")
    .select("id, name, slug, nevou_price, credit_wallets(balance, quota)")
    .maybeSingle();
  if (!b) redirect("/barbearia/nova");
  const w = Array.isArray(b.credit_wallets) ? b.credit_wallets[0] : b.credit_wallets;

  const { data: ger } = await supabase
    .from("generations")
    .select("id, nome, whatsapp, style_id, quer, source, status, created_at")
    .eq("status", "done")
    .order("created_at", { ascending: false })
    .limit(200);
  const lista = ger ?? [];
  const leads = lista.filter((g) => g.source === "qr");
  const quer = leads.filter((g) => g.quer);
  const estimado = (b.nevou_price ?? 0) * quer.length;
  const brl = (n: number) => `R$ ${n.toFixed(2).replace(".", ",")}`;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "";

  const card = "rounded-2xl border border-border bg-surface p-4";
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Painel · {b.name}</h1>
        <Link href="/fim-de-ano" className="text-sm text-muted hover:text-foreground">Catálogo</Link>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className={card}><p className="text-xs text-muted">Créditos</p><p className="text-2xl font-semibold">{w?.balance ?? 0}</p><p className="text-xs text-muted">{w ? `${w.quota - w.balance} de ${w.quota} usadas` : ""}</p></div>
        <div className={card}><p className="text-xs text-muted">Simulações</p><p className="text-2xl font-semibold">{lista.length}</p></div>
        <div className={card}><p className="text-xs text-muted">Quiseram nevar</p><p className="text-2xl font-semibold">{quer.length}</p></div>
        <div className={card}><p className="text-xs text-muted">Estimado</p><p className="text-2xl font-semibold text-accent">{brl(estimado)}</p></div>
      </section>
      <p className="mt-2 text-xs text-muted">Estimado = quem clicou em &quot;Quero esse!&quot; × preço do nevou.</p>

      <section className={`${card} mt-6`}>
        <h2 className="font-medium">QR code da barbearia</h2>
        <p className="mt-1 text-sm text-muted break-all">{site}/b/{b.slug}/nevou</p>
        <div className="mt-3 flex gap-3">
          <a href="/api/qr" className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-accent-fg">Baixar PNG</a>
          <a href="/api/qr?formato=svg" className="rounded-xl border border-border px-4 py-2 text-sm">Baixar SVG</a>
          <Link href={`/b/${b.slug}/nevou`} className="rounded-xl border border-border px-4 py-2 text-sm">Ver a página</Link>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 font-medium">Interessados</h2>
        {leads.length === 0 ? (
          <p className="text-sm text-muted">Ninguém ainda. Imprima o QR e coloque na bancada.</p>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
            {leads.map((g) => (
              <li key={g.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium">{g.nome}</p>
                  <p className="text-xs text-muted">{ESTILOS.find((e) => e.id === g.style_id)?.nome ?? g.style_id} · {new Date(g.created_at).toLocaleDateString("pt-BR")}</p>
                </div>
                <div className="flex items-center gap-3">
                  {g.quer && <span className="rounded-full bg-accent px-2 py-1 text-xs font-medium text-accent-fg">Quero esse!</span>}
                  {g.whatsapp && <a href={`https://wa.me/${g.whatsapp}`} target="_blank" rel="noreferrer" className="text-sm text-accent underline underline-offset-4">WhatsApp</a>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
