import type { FormatoRosto } from "@/lib/catalog";

// Desenho do formato "triangular" (queixo largo) no mesmo estilo dos demais (traço branco + eixos).
function Triangular() {
  return (
    <svg aria-hidden viewBox="0 0 80 80" className="h-full w-auto p-2" fill="none" stroke="#f5f5f5" strokeWidth="2" strokeLinejoin="round">
      <path d="M30 8Q40 5 50 8Q56 12 57 28Q58 40 64 50Q68 62 56 68Q40 74 24 68Q12 62 16 50Q22 40 23 28Q24 12 30 8Z" />
      <path d="M40 2V78M6 40H74" strokeDasharray="3 3" strokeWidth="1" opacity=".5" />
    </svg>
  );
}

// Cartão de formato de rosto (Figma: card-estilo-rosto). Selecionado: borda caramelo + selo.
export function CardRosto({ formato, nome, selecionado, onSelecionar }: { formato: FormatoRosto; nome: string; selecionado: boolean; onSelecionar: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelecionar}
      aria-pressed={selecionado}
      className={`relative flex h-[128px] w-full flex-col rounded-md border p-3 text-center transition active:scale-[0.98] ${
        selecionado ? "border-brand bg-brand-subtle" : "border-line bg-surface-1 hover:border-border-strong"
      }`}
    >
      <span className="flex h-20 w-full items-center justify-center overflow-hidden rounded-sm border border-line bg-surface-3">
        <span className={`flex h-full items-center justify-center transition-opacity ${selecionado ? "opacity-100" : "opacity-60"}`}>
          {formato === "triangular" ? (
            <Triangular />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/rostos/${formato}.png`} alt="" className="h-full w-auto p-2" />
          )}
        </span>
      </span>
      <span className={`mt-2 text-label ${selecionado ? "text-text" : "text-text-2"}`}>{nome}</span>
      {selecionado && (
        <span aria-hidden className="absolute right-4 top-4 flex size-4 items-center justify-center rounded-[4px] bg-brand text-bg">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5.2l2 2L8 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      )}
    </button>
  );
}
