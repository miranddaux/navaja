"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { lerPrecos } from "@/lib/precos";

export type EstadoForm = { erro?: string };

// A validação final é SEMPRE refeita no servidor (a do navegador é só conforto).
export async function criarBarbearia(_: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const whatsapp = String(formData.get("whatsapp") ?? "").replace(/\D/g, "");
  const { precos, erro: erroPreco } = lerPrecos(formData);
  if (erroPreco) return { erro: erroPreco };

  if (name.length < 2) return { erro: "Digite o nome da barbearia." };
  if (!/^[a-z0-9-]{3,40}$/.test(slug)) return { erro: "O endereço do link tem caracteres inválidos." };
  if (!/^[0-9]{10,11}$/.test(whatsapp)) return { erro: "Confira o WhatsApp com DDD." };

  const { data: nova, error } = await supabase
    .from("barbershops")
    .insert({ owner_id: user.id, name, slug, whatsapp: `55${whatsapp}` })
    .select("id")
    .single();
  if (error || !nova) {
    return { erro: error?.code === "23505" ? "Esse endereço acabou de ser usado. Escolha outro." : "Não foi possível criar. Tente de novo." };
  }
  const linhas = Object.entries(precos).map(([style_id, preco]) => ({ barbershop_id: nova.id, style_id, preco }));
  if (linhas.length) await supabase.from("precos_estilos").insert(linhas);
  redirect("/fim-de-ano");
}
