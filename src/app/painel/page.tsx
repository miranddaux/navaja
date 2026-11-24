import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ESTILOS } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/Button";
import { PageHeader } from "@/components/PageHeader";

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

  const card = "rounded-md border border-line bg-surface p-4";
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 pb-8 pt-8">
      <PageHeader titulo="Painel" voltar="/fim-de-ano" />

      <section aria-label="Resumo" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className={card}><p className="text-caption text-text-2">Créditos</p><p className="text-h2">{w?.balance ?? 0}</p><p className="text-caption text-text-2">{w ? `${w.quota - w.balance} de ${w.quota} usadas` : ""}</p></div>
        <div className={card}><p className="text-caption text-text-2">Simulações</p><p className="text-h2">{lista.length}</p></div>
        <div className={card}><p className="text-caption text-text-2">Quiseram nevar</p><p className="text-h2">{quer.length}</p></div>
        <div className={card}><p className="text-caption text-text-2">Estimado</p><p className="text-h2 text-brand">{brl(estimado)}</p></div>
      </section>
      <p className="-mt-4 text-caption text-text-2">Estimado = quem clicou em &quot;Quero esse!&quot; × preço do nevou.</p>

      <section className={`${card} flex flex-col gap-4`}>
        <h2 className="text-h4">QR code da barbearia</h2>
        <p className="break-all text-body-sm text-text-2">{site}/b/{b.slug}/nevou</p>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/api/qr" size="md" className="px-4">Baixar PNG</ButtonLink>
          <ButtonLink href="/api/qr?formato=svg" size="md" variant="secondary" className="px-4">Baixar SVG</ButtonLink>
          <ButtonLink href={`/b/${b.slug}/nevou`} size="md" variant="secondary" className="px-4">Ver a página</ButtonLink>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-h3">Interessados</h2>
        {leads.length === 0 ? (
          <p className="text-body-sm text-text-2">Ninguém ainda. Imprima o QR e coloque na bancada.</p>
        ) : (
          <ul className="divide-y divide-line rounded-md border border-line bg-surface">
            {leads.map((g) => (
              <li key={g.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-h4">{g.nome}</p>
                  <p className="text-caption text-text-2">{ESTILOS.find((e) => e.id === g.style_id)?.nome ?? g.style_id} · {new Date(g.created_at).toLocaleDateString("pt-BR")}</p>
                </div>
                <div className="flex items-center gap-3">
                  {g.quer && <span className="rounded-full border border-ok-line bg-ok-bg px-3 py-1 text-label text-ok">Quero esse!</span>}
                  {g.whatsapp && <a href={`https://wa.me/${g.whatsapp}`} target="_blank" rel="noreferrer" className="text-body-sm text-brand underline underline-offset-4">WhatsApp</a>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
