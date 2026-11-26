import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Precos } from "@/lib/precos";
import FormPrecos from "./form";

export const metadata = { title: "Preços · Navaja" };

export default function PrecosPage() {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <Conteudo />
    </Suspense>
  );
}

async function Conteudo() {
  const supabase = await createClient();
  const { data: b } = await supabase.from("barbershops").select("name, precos_estilos(style_id, preco)").maybeSingle();
  if (!b) redirect("/barbearia/nova");
  const inicial: Precos = Object.fromEntries((b.precos_estilos ?? []).map((p) => [p.style_id, Number(p.preco)]));

  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-10 px-4 pt-8 md:px-8 md:pt-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-h1">Preços</h1>
        <p className="text-body text-text-2">Defina quanto custa cada corte em {b.name}. O app mostra esses valores ao cliente e usa no cálculo do painel.</p>
      </header>
      <div className="md:max-w-[448px]"><FormPrecos inicial={inicial} /></div>
    </main>
  );
}
