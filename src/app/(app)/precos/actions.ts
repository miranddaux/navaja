"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { lerPrecos } from "@/lib/precos";

// Salva os preços de todos os cortes de uma vez (vazio = remove o preço). RLS garante que só o dono altera.
export async function salvarPrecos(formData: FormData): Promise<{ ok?: true; erro?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { erro: "Entre na sua conta para continuar." };
  const { data: b } = await supabase.from("barbershops").select("id").maybeSingle();
  if (!b) return { erro: "Cadastre sua barbearia primeiro." };

  const { precos, erro } = lerPrecos(formData);
  if (erro) return { erro };

  const ids = Object.keys(precos);
  const linhas = ids.map((style_id) => ({ barbershop_id: b.id, style_id, preco: precos[style_id], updated_at: new Date().toISOString() }));
  if (linhas.length) {
    const { error } = await supabase.from("precos_estilos").upsert(linhas, { onConflict: "barbershop_id,style_id" });
    if (error) return { erro: "Não foi possível salvar. Tente de novo." };
  }
  // remove os que ficaram em branco
  const del = supabase.from("precos_estilos").delete().eq("barbershop_id", b.id);
  const { error: e2 } = ids.length ? await del.not("style_id", "in", `(${ids.join(",")})`) : await del;
  if (e2) return { erro: "Salvamos os preços, mas não conseguimos limpar os vazios." };

  revalidatePath("/fim-de-ano");
  revalidatePath("/painel");
  return { ok: true };
}
