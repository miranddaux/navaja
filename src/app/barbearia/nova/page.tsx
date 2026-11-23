import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function criar(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const preco = Number(String(formData.get("preco") ?? "").replace(",", "."));
  if (name.length < 2 || !/^[a-z0-9-]{3,40}$/.test(slug)) redirect("/barbearia/nova?erro=dados");

  const { error } = await supabase.from("barbershops").insert({
    owner_id: user.id,
    name,
    slug,
    nevou_price: Number.isFinite(preco) && preco >= 0 ? preco : null,
  });
  if (error) redirect(`/barbearia/nova?erro=${error.code === "23505" ? "slug" : "dados"}`);
  redirect("/fim-de-ano");
}

const MSG: Record<string, string> = {
  dados: "Confira os campos: nome com 2+ letras e endereço só com letras minúsculas, números e hífen.",
  slug: "Esse endereço já está em uso. Escolha outro.",
};

export default function NovaBarbearia(props: PageProps<"/barbearia/nova">) {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <Formulario searchParams={props.searchParams} />
    </Suspense>
  );
}

async function Formulario({ searchParams }: { searchParams: PageProps<"/barbearia/nova">["searchParams"] }) {
  const { erro } = await searchParams;
  const campo = "h-12 w-full rounded-xl border border-border bg-surface px-4 outline-none placeholder:text-muted focus:border-accent";
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <form action={criar} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Sua barbearia</h1>
        <p className="text-sm text-muted">Só o básico. Você muda depois.</p>
        <label className="block text-sm text-muted">Nome
          <input name="name" required minLength={2} maxLength={80} className={`${campo} mt-1`} placeholder="Barbearia do Zé" />
        </label>
        <label className="block text-sm text-muted">Endereço do seu link
          <input name="slug" required pattern="[a-z0-9\-]{3,40}" className={`${campo} mt-1`} placeholder="barbearia-do-ze" />
          <span className="text-xs">Seu QR vai abrir /b/<em>endereço</em>/nevou</span>
        </label>
        <label className="block text-sm text-muted">Preço do nevou (R$)
          <input name="preco" inputMode="decimal" className={`${campo} mt-1`} placeholder="150" />
        </label>
        {typeof erro === "string" && MSG[erro] && <p role="alert" className="text-sm text-red-400">{MSG[erro]}</p>}
        <button className="h-12 w-full rounded-xl bg-accent font-medium text-accent-fg hover:brightness-110">Criar barbearia</button>
      </form>
    </main>
  );
}
