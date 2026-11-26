import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FluxoNevou from "./fluxo";

export default function NevouPage(props: PageProps<"/b/[slug]/nevou">) {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <Conteudo params={props.params} />
    </Suspense>
  );
}

async function Conteudo({ params }: { params: PageProps<"/b/[slug]/nevou">["params"] }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.rpc("barbearia_publica", { p_slug: slug });
  const b = data?.[0];
  if (!b) notFound();
  return <FluxoNevou slug={slug} nome={b.name} precos={(b.precos ?? {}) as Record<string, number>} whatsapp={b.whatsapp} />;
}
