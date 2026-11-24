import type { FormatoRosto } from "@/lib/catalog";

// Silhuetas simples (traço) dos 6 formatos de rosto.
const FORMAS: Record<FormatoRosto, React.ReactNode> = {
  oval: <ellipse cx="16" cy="20" rx="12" ry="17" />,
  quadrado: <rect x="5" y="4" width="22" height="32" rx="5" />,
  redondo: <circle cx="16" cy="20" r="14" />,
  triangular: <path d="M12 4h8q4 0 5 6l3 20q0 6-6 6H10q-6 0-6-6l3-20q1-6 5-6z" />,
  diamante: <path d="M16 3l10 12-3 9-7 13-7-13-3-9z" />,
  coracao: <path d="M16 38C8 30 4 22 4 14q0-8 7-9 4 0 5 4 1-4 5-4 7 1 7 9 0 8-8 24z" />,
};

export function FormatoRostoIcone({ formato }: { formato: FormatoRosto }) {
  return (
    <svg aria-hidden width="32" height="40" viewBox="0 0 32 40" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round">
      {FORMAS[formato]}
    </svg>
  );
}
