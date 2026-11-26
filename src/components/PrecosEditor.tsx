"use client";

import { useState } from "react";
import { ESTILOS } from "@/lib/catalog";
import type { Precos } from "@/lib/precos";
import { limparPreco, validarPreco } from "@/lib/validate";
import { Button } from "./Button";

const GRUPOS = [
  { id: "fim-de-ano", titulo: "Fim de Ano" },
  { id: "cortes", titulo: "Cortes" },
] as const;

// Preencher os preços de forma rápida: um valor para todos + ajuste fino em cada corte.
export function PrecosEditor({ inicial = {} }: { inicial?: Precos }) {
  const [v, setV] = useState<Record<string, string>>(() =>
    Object.fromEntries(ESTILOS.map((e) => [e.id, inicial[e.id] != null ? String(inicial[e.id]).replace(".", ",") : ""])),
  );
  const [todos, setTodos] = useState("");

  const aplicarATodos = () => {
    if (validarPreco(todos).nivel === "ok") setV(Object.fromEntries(ESTILOS.map((e) => [e.id, todos])));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 rounded-md border border-line bg-surface p-4">
        <label htmlFor="preco-todos" className="text-card text-text">Mesmo valor em todos (opcional)</label>
        <div className="flex gap-2">
          <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-sm border border-line bg-surface-1 px-3 focus-within:border-brand">
            <span className="text-body text-text-2">R$</span>
            <input id="preco-todos" inputMode="decimal" placeholder="50" value={todos} onChange={(e) => setTodos(limparPreco(e.target.value))}
              className="min-w-0 flex-1 bg-transparent text-body font-medium text-text outline-none placeholder:font-normal placeholder:text-text-2" />
          </div>
          <Button type="button" variant="secondary" size="md" className="px-4" onClick={aplicarATodos} disabled={validarPreco(todos).nivel !== "ok"}>Aplicar</Button>
        </div>
        <p className="text-caption text-text-2">Depois ajuste só os que forem diferentes. Pode deixar em branco e preencher depois.</p>
      </div>

      {GRUPOS.map((g) => (
        <fieldset key={g.id} className="flex flex-col gap-2">
          <legend className="mb-2 text-h4">{g.titulo}</legend>
          {ESTILOS.filter((e) => e.categoria === g.id).map((e) => {
            const estado = validarPreco(v[e.id]);
            return (
              <div key={e.id} className="flex items-center justify-between gap-4 rounded-md border border-line bg-surface-1 p-3">
                <label htmlFor={`preco_${e.id}`} className="min-w-0 truncate text-body text-text">{e.nome}</label>
                <div className={`flex h-11 w-[132px] shrink-0 items-center gap-2 rounded-sm border bg-surface px-3 focus-within:border-brand ${estado.nivel === "erro" ? "border-error" : "border-line"}`}>
                  <span className="text-body text-text-2">R$</span>
                  <input id={`preco_${e.id}`} name={`preco_${e.id}`} inputMode="decimal" placeholder="0" value={v[e.id]}
                    aria-invalid={estado.nivel === "erro" || undefined}
                    onChange={(ev) => setV((a) => ({ ...a, [e.id]: limparPreco(ev.target.value) }))}
                    className="min-w-0 flex-1 bg-transparent text-body font-medium text-text outline-none placeholder:font-normal placeholder:text-text-2" />
                </div>
              </div>
            );
          })}
        </fieldset>
      ))}
    </div>
  );
}
