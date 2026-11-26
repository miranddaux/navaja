"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { createClient } from "@/lib/supabase/client";
import { validarEmail } from "@/lib/validate";

// Foto de fundo (public/hero.jpg). Se o arquivo não existir, aparece só o degradê de marca.
const FUNDO =
  "linear-gradient(180deg, rgba(10,10,10,0) 35%, #0a0a0a 78%), url(/hero.jpg), radial-gradient(120% 60% at 50% 0%, rgba(196,137,74,0.18), transparent 70%)";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [etapa, setEtapa] = useState<"email" | "codigo">("email");
  const [enviando, setEnviando] = useState(false);
  const [verificando, setVerificando] = useState(false);
  const [erro, setErro] = useState("");
  const [espera, setEspera] = useState(0); // segundos até poder reenviar

  const validacao = validarEmail(email);
  const origem = () => process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

  useEffect(() => {
    if (espera <= 0) return;
    const t = setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [espera]);

  async function enviar(e?: React.FormEvent) {
    e?.preventDefault();
    if (validacao.nivel !== "ok") return;
    setEnviando(true);
    setErro("");
    const { error } = await createClient().auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${origem()}/auth/callback` },
    });
    setEnviando(false);
    if (error) {
      setErro(error.status === 429 ? "Muitos pedidos seguidos. Aguarde alguns minutos e tente de novo." : "Não conseguimos enviar. Confira o e-mail e tente de novo.");
      return;
    }
    setEtapa("codigo");
    setCodigo("");
    setEspera(30);
  }

  async function confirmar(valor: string) {
    setVerificando(true);
    setErro("");
    const { error } = await createClient().auth.verifyOtp({ email: email.trim(), token: valor, type: "email" });
    if (error) {
      setVerificando(false);
      setErro("Código incorreto ou vencido. Confira os 6 números ou peça um novo.");
      return;
    }
    router.replace("/fim-de-ano");
    router.refresh();
  }

  function aoDigitarCodigo(v: string) {
    const so = v.replace(/\D/g, "").slice(0, 6);
    setCodigo(so);
    if (so.length === 6 && !verificando) confirmar(so); // confirma sozinho ao completar
  }

  return (
    <main
      className="mx-auto flex w-full max-w-[448px] flex-1 flex-col justify-end gap-10 bg-cover bg-top bg-no-repeat px-4 pb-8 pt-16"
      style={{ backgroundImage: FUNDO, backgroundColor: "#0a0a0a" }}
    >
      <div className="flex flex-col gap-4">
        <p className="text-h3 text-brand">Navaja</p>
        <h1 className="text-display">Sua barbearia organizada, seus clientes encantados</h1>
      </div>

      {etapa === "email" ? (
        <form onSubmit={enviar} noValidate className="flex flex-col gap-6">
          <Field
            id="email" label="Seu e-mail" type="email" inputMode="email" autoComplete="email" autoCapitalize="none"
            placeholder="voce@exemplo.com" value={email} onChange={setEmail} estado={validacao}
            ajuda="Sem senha: enviamos um código de 6 números para você."
          />
          <Button type="submit" loading={enviando} disabled={validacao.nivel !== "ok"}>Receber código</Button>
          {erro && <p role="alert" className="rounded-sm border border-error-line bg-error-bg p-4 text-body-sm text-error">{erro}</p>}
        </form>
      ) : (
        <div className="flex flex-col gap-6">
          <div role="status" className="flex flex-col gap-1 rounded-md border border-ok-line bg-ok-bg p-4">
            <p className="text-h4 text-ok">Código enviado</p>
            <p className="text-body-sm text-text-2">
              Enviamos 6 números para <strong className="text-text">{email.trim()}</strong>. Pode cair no spam.
            </p>
          </div>
          <Field
            id="codigo" label="Código de 6 números" inputMode="numeric" autoComplete="one-time-code" placeholder="000000"
            maxLength={6} value={codigo} onChange={aoDigitarCodigo}
            estado={erro ? { nivel: "erro", msg: erro } : undefined}
            ajuda="Digite o código. Se o e-mail trouxer um link, também pode tocar nele."
          />
          <Button type="button" loading={verificando} disabled={codigo.length !== 6} onClick={() => confirmar(codigo)}>Entrar</Button>
          <div className="flex flex-col gap-2">
            <Button type="button" variant="secondary" size="md" onClick={() => enviar()} loading={enviando} disabled={espera > 0}>
              {espera > 0 ? `Reenviar código em ${espera}s` : "Reenviar código"}
            </Button>
            <Button type="button" variant="ghost" size="md" onClick={() => { setEtapa("email"); setErro(""); }}>Usar outro e-mail</Button>
          </div>
        </div>
      )}

      <p className="text-center text-caption text-text-off">
        Ao continuar, você concorda com os Termos de Uso e Política de Privacidade da Navaja.
      </p>
    </main>
  );
}
