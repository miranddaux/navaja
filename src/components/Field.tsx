"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import type { Estado } from "@/lib/validate";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  id: string;
  label: string;
  value: string;
  onChange: (valor: string) => void;
  /** Resultado da validação ao vivo (vazio | dica | erro | ok) */
  estado?: Estado;
  /** Texto de ajuda fixo, quando não há mensagem de validação */
  ajuda?: ReactNode;
  /** Mostra "(opcional)" ao lado do rótulo */
  opcional?: boolean;
  /** Elemento no início do campo (ex.: prefixo do link) */
  prefixo?: ReactNode;
  /** Elemento no fim do campo (ex.: spinner) */
  sufixo?: ReactNode;
};

// Campo padrão: rótulo 12px, input 52px, texto digitado em cor primária
// (o placeholder fica em cinza para nunca parecer valor preenchido).
export function Field({ id, label, value, onChange, estado, ajuda, opcional, prefixo, sufixo, ...rest }: Props) {
  const nivel = estado?.nivel ?? "vazio";
  const msg = estado?.msg;
  const borda =
    nivel === "erro"
      ? "border-error"
      : nivel === "ok"
        ? "border-ok-line focus-within:border-ok"
        : "border-line focus-within:border-brand";
  const idMsg = `${id}-msg`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-label text-text-2">
        {label}
        {opcional && <span className="ml-1 font-normal text-text-off"> (opcional)</span>}
      </label>
      <div className={`flex h-[52px] items-center gap-2 rounded-sm border bg-surface px-4 transition ${borda}`}>
        {prefixo && <span className="shrink-0 text-body-sm text-text-2">{prefixo}</span>}
        <input
          {...rest}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={nivel === "erro" || undefined}
          aria-describedby={idMsg}
          className="min-w-0 flex-1 bg-transparent text-body font-medium text-text outline-none placeholder:font-normal placeholder:text-text-2"
        />
        {sufixo}
        {nivel === "ok" && !sufixo && (
          <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 text-ok">
            <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      {/* Região "viva": leitores de tela anunciam a mensagem enquanto a pessoa digita */}
      <p
        id={idMsg}
        aria-live="polite"
        className={`min-h-[16px] text-caption ${
          nivel === "erro" ? "text-error" : nivel === "ok" && msg ? "text-ok" : "text-text-2"
        }`}
      >
        {msg ?? ajuda}
      </p>
    </div>
  );
}
