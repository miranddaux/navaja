"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "enviado" | "erro">("idle");
  const [mensagem, setMensagem] = useState("");

  const origem = () => process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

  async function entrarComEmail(e: React.FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    const { error } = await createClient().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${origem()}/auth/callback` },
    });
    if (error) {
      setEstado("erro");
      setMensagem("Não deu certo. Confira o e-mail e tente de novo.");
    } else {
      setEstado("enviado");
    }
  }

  async function entrarComGoogle() {
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origem()}/auth/callback` },
    });
    if (error) {
      setEstado("erro");
      setMensagem("Não foi possível entrar com o Google agora.");
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Nav<span className="text-accent">aja</span>
          </h1>
          <p className="mt-2 text-sm text-muted">Entre para abrir a sua barbearia.</p>
        </div>

        {estado === "enviado" ? (
          <div className="rounded-2xl border border-border bg-surface p-6 text-center">
            <p className="font-medium">Confira o seu e-mail</p>
            <p className="mt-2 text-sm text-muted">
              Enviamos um link para <strong className="text-foreground">{email}</strong>. Toque nele para entrar.
            </p>
          </div>
        ) : (
          <form onSubmit={entrarComEmail} className="space-y-3">
            <label htmlFor="email" className="block text-sm text-muted">
              Seu e-mail
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.com"
              className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-foreground outline-none placeholder:text-muted focus:border-accent"
            />
            <button
              type="submit"
              disabled={estado === "enviando"}
              className="h-12 w-full rounded-xl bg-accent font-medium text-accent-fg transition hover:brightness-110 disabled:opacity-60"
            >
              {estado === "enviando" ? "Enviando…" : "Receber link de acesso"}
            </button>
            <div className="flex items-center gap-3 py-2 text-xs text-muted">
              <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
            </div>
            <button
              type="button"
              onClick={entrarComGoogle}
              className="h-12 w-full rounded-xl border border-border bg-surface font-medium transition hover:bg-surface-2"
            >
              Continuar com Google
            </button>
            {estado === "erro" && (
              <p role="alert" className="text-sm text-red-400">
                {mensagem}
              </p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
