"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { createClient } from "@/lib/supabase/client";
import { validarEmail } from "@/lib/validate";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "enviado" | "erro">("idle");
  const [erroEnvio, setErroEnvio] = useState("");

  const validacao = validarEmail(email);
  const valido = validacao.nivel === "ok";
  const origem = () => process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

  async function entrarComEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!valido) return;
    setEstado("enviando");
    const { error } = await createClient().auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${origem()}/auth/callback` },
    });
    if (error) {
      setEstado("erro");
      setErroEnvio(
        error.status === 429
          ? "Muitos pedidos seguidos. Aguarde alguns minutos e tente de novo."
          : "Não conseguimos enviar o link. Confira o e-mail e tente de novo.",
      );
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
      setErroEnvio("Não foi possível entrar com o Google agora.");
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-[448px] flex-1 flex-col justify-end gap-10 bg-[radial-gradient(120%_60%_at_50%_0%,rgba(196,137,74,0.18),transparent_70%)] px-4 pb-8 pt-16">
      <div className="flex flex-col gap-4">
        <p className="text-h3 text-brand">Navaja</p>
        <h1 className="text-display">Sua barbearia organizada, seus clientes encantados</h1>
      </div>

      {estado === "enviado" ? (
        <div role="status" className="flex flex-col gap-2 rounded-lg border border-ok-line bg-ok-bg p-6">
          <p className="text-h4 text-ok">Confira o seu e-mail</p>
          <p className="text-body-sm text-text-2">
            Enviamos um link para <strong className="text-text">{email.trim()}</strong>. Toque nele para entrar. Pode
            cair no spam.
          </p>
          <button onClick={() => setEstado("idle")} className="mt-2 self-start text-body-sm text-brand underline underline-offset-4">
            Usar outro e-mail
          </button>
        </div>
      ) : (
        <form onSubmit={entrarComEmail} noValidate className="flex flex-col gap-6">
          <Field
            id="email"
            label="Seu e-mail"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={setEmail}
            estado={validacao}
            ajuda="Sem senha: enviamos um link de acesso para você."
          />
          <Button type="submit" loading={estado === "enviando"} disabled={!valido}>
            Receber link de acesso
          </Button>
          {estado === "erro" && (
            <p role="alert" className="rounded-sm border border-error-line bg-error-bg p-4 text-body-sm text-error">
              {erroEnvio}
            </p>
          )}
          {process.env.NEXT_PUBLIC_GOOGLE_LOGIN === "true" && (
            <Button type="button" variant="secondary" onClick={entrarComGoogle}>
              Continuar com Google
            </Button>
          )}
        </form>
      )}

      <p className="text-center text-caption text-text-off">
        Ao continuar, você concorda com os Termos de Uso e Política de Privacidade da Navaja.
      </p>
    </main>
  );
}
