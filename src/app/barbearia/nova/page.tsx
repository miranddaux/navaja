import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import FormBarbearia from "./form";

export const metadata = { title: "Sua barbearia · Navaja" };

export default function NovaBarbearia() {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <Conteudo />
    </Suspense>
  );
}

async function Conteudo() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  // Quem já tem barbearia não precisa cadastrar de novo.
  const { data } = await supabase.from("barbershops").select("id").maybeSingle();
  if (data) redirect("/fim-de-ano");
  return <FormBarbearia />;
}
