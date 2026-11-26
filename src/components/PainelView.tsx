import Link from "next/link";
import { ButtonLink } from "./Button";
import { CopyButton } from "./CopyButton";
import { Progress } from "./Progress";
import { ESTILOS } from "@/lib/catalog";
import { brl, data } from "@/lib/format";

export type Lead = { id: string; nome: string | null; whatsapp: string | null; style_id: string; quer: boolean; created_at: string; semFoto?: boolean };
export type PainelProps = {
  nome: string; slug: string; saldo: number; cota: number; precos: Record<string, number>; siteUrl: string;
  simulacoes: number; leads: Lead[];
};

const card = "rounded-md border border-line bg-surface p-4";

// Ritmo de espaço: 8 dentro do bloco · 16 entre itens relacionados · 32 entre blocos · 40 entre seções.
export function PainelView(p: PainelProps) {
  const quer = p.leads.filter((l) => l.quer);
  const estimado = quer.reduce((t, l) => t + (p.precos[l.style_id] ?? 0), 0);
  const semPrecos = Object.keys(p.precos).length === 0;
  const link = `${p.siteUrl}/b/${p.slug}/nevou`;
  const usadas = p.cota - p.saldo;
  const baixo = p.saldo <= Math.max(2, Math.floor(p.cota * 0.2));

  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-10 px-4 pt-8 md:px-8 md:pt-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-h1">Painel</h1>
        <p className="text-body text-text-2">Resultado da Operação Nevou em {p.nome}.</p>
      </header>

      <section aria-label="Resumo" className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
          <div className={`${card} flex flex-col gap-2`}>
            <p className="text-caption text-text-2">Provas restantes</p>
            <p className={`text-h2 ${baixo ? "text-error" : ""}`}>{p.saldo}</p>
            <Progress valor={usadas} max={p.cota} rotulo="Provas usadas" />
            <p className="text-caption text-text-2">{usadas} de {p.cota} usadas</p>
          </div>
          <div className={`${card} flex flex-col gap-2`}><p className="text-caption text-text-2">Simulações</p><p className="text-h2">{p.simulacoes}</p></div>
          <div className={`${card} flex flex-col gap-2`}><p className="text-caption text-text-2">Quiseram nevar</p><p className="text-h2">{quer.length}</p></div>
          <div className={`${card} flex flex-col gap-2`}><p className="text-caption text-text-2">Estimado</p><p className="text-h2 text-brand">{brl(estimado)}</p></div>
        </div>
        <p className="text-caption text-text-2">Estimado = quem clicou em &quot;Quero esse!&quot; × preço do corte escolhido{semPrecos ? " (defina os preços em \"Preços\" para ver o valor)" : ""}.</p>
        {baixo && (
          <p role="alert" className="rounded-sm border border-error-line bg-error-bg p-4 text-body-sm text-error">
            Suas provas estão acabando. Fale com o suporte para liberar mais.
          </p>
        )}
      </section>

      <section aria-labelledby="qr" className={`${card} flex flex-col gap-4 md:flex-row md:items-center md:justify-between`}>
        <div className="flex min-w-0 flex-col gap-2">
          <h2 id="qr" className="text-h4">QR code da barbearia</h2>
          <p className="break-all text-body-sm text-text-2">{link}</p>
          <p className="text-caption text-text-2">Baixe o QR para a sua arte ou imprima a arte pronta do display (A6). Quem escanear faz a simulação e você recebe o contato.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/api/qr" size="md" className="px-4">Baixar</ButtonLink>
          <ButtonLink href="/painel/display" size="md" variant="secondary" className="px-4">Arte do display</ButtonLink>
          <CopyButton texto={link} />
          <ButtonLink href={`/b/${p.slug}/nevou`} size="md" variant="ghost" className="px-4" target="_blank">Ver a página</ButtonLink>
        </div>
      </section>

      <section aria-labelledby="interessados" className="flex flex-col gap-4">
        <h2 id="interessados" className="text-h2">Interessados</h2>
        {p.leads.length === 0 ? (
          <div className={`${card} flex flex-col gap-4`}>
            <p className="text-h4">Ainda ninguém escaneou</p>
            <ol className="flex list-decimal flex-col gap-2 pl-6 text-body-sm text-text-2">
              <li>Baixe o QR code ou a arte do display acima.</li>
              <li>Imprima e coloque o display na bancada.</li>
              <li>Quando alguém simular, o contato aparece aqui.</li>
            </ol>
          </div>
        ) : (
          <ul className="divide-y divide-line rounded-md border border-line bg-surface">
            {p.leads.map((g) => (
              <li key={g.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                  <p className="flex items-center gap-2 text-h4">{g.nome}{g.semFoto && <span className="rounded-full border border-line px-2 py-0.5 text-caption text-text-2">sem foto</span>}</p>
                  <p className="text-caption text-text-2">{ESTILOS.find((e) => e.id === g.style_id)?.nome ?? g.style_id} · {data(g.created_at)}</p>
                </div>
                <div className="flex items-center gap-4">
                  {g.quer && <span className="rounded-full border border-ok-line bg-ok-bg px-3 py-1 text-label text-ok">Quero esse!</span>}
                  {g.whatsapp && (
                    <Link href={`https://wa.me/${g.whatsapp.startsWith("55") ? g.whatsapp : "55" + g.whatsapp}`} target="_blank" rel="noreferrer" className="flex min-h-[44px] items-center text-body-sm text-brand underline underline-offset-4">
                      Chamar no WhatsApp
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
