"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type EstadoForm = { erro?: string };

// A validação final é SEMPRE refeita no servidor (a do navegador é só conforto).
export async function criarBarbearia(_: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const whatsapp = String(formData.get("whatsapp") ?? "").replace(/\D/g, "");
  const preco = Number(String(formData.get("preco") ?? "").replace(",", "."));

  if (name.length < 2) return { erro: "Digite o nome da barbearia." };
  if (!/^[a-z0-9-]{3,40}$/.test(slug)) return { erro: "O endereço do link tem caracteres inválidos." };
  if (!/^[0-9]{10,11}$/.test(whatsapp)) return { erro: "Confira o WhatsApp com DDD." };

  const { error } = await supabase.from("barbershops").insert({
    owner_id: user.id,
    name,
    slug,
    whatsapp: `55${whatsapp}`,
    nevou_price: Number.isFinite(preco) && preco >= 0 && formData.get("preco") ? preco : null,
  });
  if (error) {
    return { erro: error.code === "23505" ? "Esse endereço acabou de ser usado. Escolha outro." : "Não foi possível criar. Tente de novo." };
  }
  redirect("/fim-de-ano");
}
