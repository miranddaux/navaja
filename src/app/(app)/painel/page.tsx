import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PainelView } from "@/components/PainelView";

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
    .select("name, slug, credit_wallets(balance, quota), precos_estilos(style_id, preco)")
    .maybeSingle();
  if (!b) redirect("/barbearia/nova");
  const w = Array.isArray(b.credit_wallets) ? b.credit_wallets[0] : b.credit_wallets;

  const { data: ger } = await supabase
    .from("generations")
    .select("id, nome, whatsapp, style_id, quer, source, created_at")
    .eq("status", "done")
    .order("created_at", { ascending: false })
    .limit(200);
  const lista = ger ?? [];

  // Interessados que escolheram o caminho sem foto
  const { data: semFoto } = await supabase
    .from("interessados")
    .select("id, nome, whatsapp, style_id, quer, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  const leads = [
    ...lista.filter((g) => g.source === "qr"),
    ...(semFoto ?? []).map((i) => ({ ...i, semFoto: true })),
  ].sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <PainelView
      nome={b.name} slug={b.slug} precos={Object.fromEntries((b.precos_estilos ?? []).map((x) => [x.style_id, Number(x.preco)]))}
      saldo={w?.balance ?? 0} cota={w?.quota ?? 0}
      siteUrl={process.env.NEXT_PUBLIC_SITE_URL || ""}
      simulacoes={lista.length}
      leads={leads}
    />
  );
}
