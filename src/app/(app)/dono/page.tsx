import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DonoView } from "@/components/DonoView";
import type { PainelDono } from "@/lib/dono";

export const metadata = { title: "Painel do dono · Navaja" };

export default function DonoPage() {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <Dono />
    </Suspense>
  );
}

async function Dono() {
  const supabase = await createClient();
  const { data: ehDono } = await supabase.rpc("eh_dono");
  if (!ehDono) notFound(); // quem não é dono nem descobre que a página existe
  const { data, error } = await supabase.rpc("painel_dono");
  if (error || !data) throw new Error("Não foi possível carregar o painel do dono.");
  return <DonoView d={data as PainelDono} />;
}
