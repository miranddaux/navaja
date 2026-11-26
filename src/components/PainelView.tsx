import { ButtonLink } from "./Button";
import { CopyButton } from "./CopyButton";
import { Progress } from "./Progress";
import { ESTILOS } from "@/lib/catalog";
import { brl, data } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";

export type Lead = { id: string; nome: string | null; whatsapp: string | null; style_id: string; quer: boolean; created_at: string; semFoto?: boolean };
export type PainelProps = {
  nome: string; slug: string; saldo: number; cota: number; precos: Record<string, number>; siteUrl: string;
  simulacoes: number; leads: Lead[]; qr: string;
};

const card = "rounded-md border border-line bg-surface-1 p-4";

// Ritmo: 8 dentro do bloco · 16 entre itens relacionados · 24 entre grupos · 40 entre seções.
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

      {/* 1. Números */}
      <section aria-label="Resumo" className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
          <div className={`${card} flex flex-col gap-2`}>
            <p className="text-body-sm text-text-2">Provas restantes</p>
            <p className={`text-h1 ${baixo ? "text-error" : ""}`}>{p.saldo}</p>
            <Progress valor={usadas} max={p.cota} rotulo="Provas usadas" />
            <p className="text-caption text-text-2">{usadas} de {p.cota} usadas</p>
          </div>
          <div className={`${card} flex flex-col gap-2`}>
            <p className="text-body-sm text-text-2">Simulações feitas</p>
            <p className="text-h1">{p.simulacoes}</p>
          </div>
          <div className={`${card} flex flex-col gap-2`}>
            <p className="text-body-sm text-text-2">Quiseram o corte</p>
            <p className="text-h1">{quer.length}</p>
          </div>
          <div className={`${card} flex flex-col gap-2`}>
            <p className="text-body-sm text-text-2">Receita estimada</p>
            <p className="text-h1 text-brand">{brl(estimado)}</p>
          </div>
        </div>
        <p className="text-caption text-text-2">
          Receita estimada = quem tocou em &quot;Quero esse!&quot; × preço do corte escolhido{semPrecos ? ' (defina os preços em "Preços" para ver o valor)' : ""}.
        </p>
        {baixo && (
          <p role="alert" className="rounded-sm border border-error-line bg-error-bg p-4 text-body text-error">
            Suas provas estão acabando. Fale com o suporte para liberar mais.
          </p>
        )}
      </section>

      {/* 2. QR code (aparece na tela: basta apontar a câmera para testar) */}
      <section aria-labelledby="qr" className="rounded-md border border-line bg-surface-1 p-6">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-8">
          <div className="shrink-0 rounded-lg bg-white p-4">
            <div role="img" aria-label={`QR code que abre ${link}`} className="size-[176px] [&>svg]:block [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: p.qr }} />
          </div>
          <div className="flex w-full min-w-0 flex-col gap-6 md:flex-1">
            <div className="flex flex-col gap-2">
              <h2 id="qr" className="text-h2">Seu QR code</h2>
              <p className="text-body text-text-2">Quem escanear faz a simulação do Nevou e você recebe o contato. Aponte a câmera do celular para testar agora.</p>
            </div>
            <div className="flex flex-col gap-1 rounded-sm border border-line bg-surface p-3">
              <p className="text-caption text-text-2">Link da sua página</p>
              <p className="break-all text-body-sm text-text">{link}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <CopyButton texto={link} className="w-full sm:w-auto" />
              <ButtonLink href={`/b/${p.slug}/nevou`} size="md" variant="secondary" className="w-full px-4 sm:w-auto" target="_blank">Ver a página</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interessados */}
      <section aria-labelledby="interessados" className="flex flex-col gap-4">
        <h2 id="interessados" className="text-h2">Interessados</h2>
        {p.leads.length === 0 ? (
          <div className={`${card} flex flex-col gap-4`}>
            <p className="text-h4">Ainda ninguém escaneou</p>
            <ol className="flex list-decimal flex-col gap-2 pl-6 text-body text-text-2">
              <li>Coloque o display com o QR na bancada.</li>
              <li>Peça para um cliente escanear e fazer a simulação.</li>
              <li>O nome e o WhatsApp dele aparecem aqui.</li>
            </ol>
          </div>
        ) : (
          <ul className="divide-y divide-line rounded-md border border-line bg-surface-1">
            {p.leads.map((g) => (
              <li key={g.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="flex flex-wrap items-center gap-2 text-h4">
                    {g.nome}
                    {g.semFoto && <span className="rounded-full border border-line px-2 py-0.5 text-caption font-normal text-text-2">sem foto</span>}
                    {g.quer && <span className="rounded-full border border-ok-line bg-ok-bg px-2 py-0.5 text-caption font-normal text-ok">Quero esse!</span>}
                  </p>
                  <p className="text-body-sm text-text-2">
                    {ESTILOS.find((e) => e.id === g.style_id)?.nome ?? g.style_id} · {data(g.created_at)}
                    {p.precos[g.style_id] != null && <> · {brl(p.precos[g.style_id])}</>}
                  </p>
                </div>
                {g.whatsapp && (
                  <ButtonLink href={waLink(g.whatsapp, `Oi, ${g.nome}! Aqui é da ${p.nome}. Vi que você escolheu o ${ESTILOS.find((e) => e.id === g.style_id)?.nome ?? "corte"} no nosso Nevou. Posso te ajudar a agendar?`)} target="_blank" rel="noreferrer" size="sm" variant="secondary" className="w-full sm:w-auto">
                    Chamar no WhatsApp
                  </ButtonLink>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
