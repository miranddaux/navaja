import { ButtonLink } from "./Button";
import { Progress } from "./Progress";
import { brl, data } from "@/lib/format";
import type { PainelDono } from "@/lib/dono";

const card = "rounded-md border border-line bg-surface p-4";

export function DonoView({ d }: { d: PainelDono }) {
  const custoMes = (d.mes * d.custo_centavos) / 100;
  const custoHoje = (d.hoje * d.custo_centavos) / 100;
  const taxaFalha = d.mes + d.falhas_mes > 0 ? Math.round((d.falhas_mes / (d.mes + d.falhas_mes)) * 100) : 0;

  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-10 px-4 pt-8 md:px-8 md:pt-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-h1">Painel do dono</h1>
        <p className="text-body text-text-2">Visão geral da plataforma: barbearias, uso da IA e custo.</p>
      </header>

      <section aria-label="Indicadores" className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
          <div className={`${card} col-span-2 flex flex-col gap-2 md:col-span-1`}>
            <p className="text-caption text-text-2">Gerações hoje</p>
            <p className="text-h2">{d.hoje} <span className="text-body text-text-2">/ {d.teto}</span></p>
            <Progress valor={d.hoje} max={d.teto} rotulo="Uso do teto diário" />
            <p className="text-caption text-text-2">Teto diário · custo hoje {brl(custoHoje)}</p>
          </div>
          <div className={`${card} flex flex-col gap-2`}><p className="text-caption text-text-2">Gerações no mês</p><p className="text-h2">{d.mes}</p></div>
          <div className={`${card} flex flex-col gap-2`}><p className="text-caption text-text-2">Custo de IA no mês</p><p className="text-h2 text-brand">{brl(custoMes)}</p><p className="text-caption text-text-2">estimado · {brl(d.custo_centavos / 100)} por imagem</p></div>
          <div className={`${card} flex flex-col gap-2`}><p className="text-caption text-text-2">Falhas no mês</p><p className={`text-h2 ${taxaFalha >= 10 ? "text-error" : ""}`}>{d.falhas_mes}</p><p className="text-caption text-text-2">{taxaFalha}% das tentativas</p></div>
        </div>
        <p className="text-caption text-text-2">O custo por imagem e o teto diário ficam na tabela <code>app_settings</code> do Supabase.</p>
      </section>

      <section aria-labelledby="barbearias" className="flex flex-col gap-4">
        <h2 id="barbearias" className="text-h2">Barbearias ({d.barbearias.length})</h2>
        {d.barbearias.length === 0 ? (
          <div className={card}><p className="text-body text-text-2">Nenhuma barbearia cadastrada ainda.</p></div>
        ) : (
          <>
            {/* Celular: um cartão por barbearia */}
            <ul className="flex flex-col gap-2 md:hidden">
              {d.barbearias.map((b) => (
                <li key={b.id} className={`${card} flex flex-col gap-4`}>
                  <div className="flex flex-col gap-1">
                    <p className="text-h4">{b.nome}</p>
                    <p className="break-all text-caption text-text-2">{b.email} · /b/{b.slug}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Progress valor={(b.cota ?? 0) - (b.saldo ?? 0)} max={b.cota ?? 0} rotulo="Provas usadas" />
                    <p className="text-caption text-text-2">{(b.cota ?? 0) - (b.saldo ?? 0)} de {b.cota ?? 0} provas usadas</p>
                  </div>
                  <dl className="grid grid-cols-3 gap-2 text-center">
                    <div><dt className="text-caption text-text-2">Simulações</dt><dd className="text-h4">{b.sims_mes}</dd></div>
                    <div><dt className="text-caption text-text-2">Quiseram</dt><dd className="text-h4">{b.quer_mes}</dd></div>
                    <div><dt className="text-caption text-text-2">Desde</dt><dd className="text-h4">{data(b.criada)}</dd></div>
                  </dl>
                  <ButtonLink href={`/api/qr?slug=${b.slug}`} size="sm" variant="secondary" className="w-full">Baixar QR (PNG)</ButtonLink>
                </li>
              ))}
            </ul>
            {/* Tablet/computador: tabela */}
            <div className="hidden overflow-hidden rounded-md border border-line bg-surface md:block">
              <table className="w-full text-left">
                <caption className="sr-only">Barbearias cadastradas</caption>
                <thead className="border-b border-line text-caption text-text-2">
                  <tr>
                    <th scope="col" className="p-4 font-medium">Barbearia</th>
                    <th scope="col" className="p-4 font-medium">Provas (mês)</th>
                    <th scope="col" className="p-4 text-right font-medium">Simulações</th>
                    <th scope="col" className="p-4 text-right font-medium">Quiseram</th>
                    <th scope="col" className="p-4 text-right font-medium">Desde</th>
                    <th scope="col" className="p-4 text-right font-medium">QR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-body-sm">
                  {d.barbearias.map((b) => (
                    <tr key={b.id}>
                      <th scope="row" className="p-4 font-normal">
                        <p className="text-h4">{b.nome}</p>
                        <p className="text-caption text-text-2">{b.email} · /b/{b.slug}</p>
                      </th>
                      <td className="w-[240px] p-4">
                        <div className="flex flex-col gap-2">
                          <Progress valor={(b.cota ?? 0) - (b.saldo ?? 0)} max={b.cota ?? 0} rotulo={`Provas usadas por ${b.nome}`} />
                          <span className="text-caption text-text-2">{(b.cota ?? 0) - (b.saldo ?? 0)} de {b.cota ?? 0}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right text-h4">{b.sims_mes}</td>
                      <td className="p-4 text-right text-h4">{b.quer_mes}</td>
                      <td className="p-4 text-right text-text-2">{data(b.criada)}</td>
                      <td className="p-4 text-right"><ButtonLink href={`/api/qr?slug=${b.slug}`} size="sm" variant="secondary">Baixar PNG</ButtonLink></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
