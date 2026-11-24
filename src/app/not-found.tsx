import { ButtonLink } from "@/components/Button";

export default function NaoEncontrado() {
  return (
    <main className="mx-auto flex w-full max-w-[448px] flex-1 flex-col justify-center gap-6 px-4 py-16">
      <div className="flex flex-col gap-2">
        <p className="text-h3 text-brand">404</p>
        <h1 className="text-h2">Página não encontrada</h1>
        <p className="text-body-sm text-text-2">O link pode estar errado ou a barbearia mudou o endereço. Confira e tente de novo.</p>
      </div>
      <ButtonLink href="/">Voltar ao início</ButtonLink>
    </main>
  );
}
