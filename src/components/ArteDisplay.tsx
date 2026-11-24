import type { ReactNode } from "react";

// Arte do display A6 (10,5 × 14,8 cm). Tamanhos em cqw: escala igual na tela e na impressão.
export function ArteDisplay({ nome, qr }: { nome: string; qr: string }): ReactNode {
  return (
        <div
          className="relative aspect-[105/148] w-full overflow-hidden rounded-lg border border-line bg-[linear-gradient(155deg,#34322e_0%,#171615_55%,#0a0a0a_100%)] [container-type:inline-size] print:h-[148mm] print:w-[105mm] print:rounded-none print:border-0"
        >
          <svg aria-hidden className="absolute inset-0 size-full">
            <defs>
              <pattern id="neve-a6" width="96" height="96" patternUnits="userSpaceOnUse">
                <circle cx="12" cy="18" r="2.5" fill="#f5f5f5" opacity=".5" /><circle cx="58" cy="10" r="1.5" fill="#f5f5f5" opacity=".35" />
                <circle cx="80" cy="44" r="3" fill="#f5f5f5" opacity=".55" /><circle cx="34" cy="60" r="1.5" fill="#f5f5f5" opacity=".3" />
                <circle cx="64" cy="84" r="2" fill="#f5f5f5" opacity=".45" /><circle cx="8" cy="88" r="1.5" fill="#f5f5f5" opacity=".25" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#neve-a6)" />
          </svg>
          <div className="relative flex h-full flex-col items-center justify-between p-[7cqw] text-center">
            <span className="rounded-full border border-brand-pressed bg-brand px-[3.5cqw] py-[1.2cqw] text-[3.4cqw] font-medium leading-none text-bg">Operação Nevou · Réveillon</span>
            <h2 className="uppercase text-[17cqw] leading-[0.95]" style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}>
              Vai nevar?<br /><span className="text-brand">Veja antes!</span>
            </h2>
            <div className="w-[50cqw] rounded-[4cqw] bg-white p-[3.5cqw]">
              <div className="[&>svg]:block [&>svg]:h-auto [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: qr }} />
            </div>
            <div className="flex flex-col gap-[1.5cqw]">
              <p className="text-[4.8cqw] font-medium leading-tight">Aponte a câmera do celular</p>
              <p className="text-[3.5cqw] leading-tight text-text-2">Veja como o platinado fica em você em 1 minuto</p>
              <p className="mt-[2cqw] text-[4.6cqw] font-medium leading-tight text-brand">{nome}</p>
            </div>
          </div>
        </div>
  );
}
