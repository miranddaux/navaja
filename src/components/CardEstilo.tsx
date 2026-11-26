import type { ReactNode } from "react";
import { FotoEstilo } from "./FotoEstilo";

// Cartão de estilo (Figma: card-estilo): fundo surface-1, foto quadrada com raio 8 e nome (14px) embaixo.
// `larga`: quando sobra um cartão sozinho na última linha (celular), ele ocupa a linha toda, sem buraco.
export function CardEstilo({ id, tom, nome, larga, children }: { id: string; tom: string; nome: string; larga?: boolean; children?: ReactNode }) {
  return (
    <li className={`flex gap-2 rounded-md bg-surface-1 p-3 ${larga ? "col-span-2 items-center gap-4 sm:col-span-1 sm:flex-col sm:items-stretch sm:gap-2" : "flex-col"}`}>
      <FotoEstilo id={id} tom={tom} className={`aspect-square rounded-sm ${larga ? "w-[96px] shrink-0 sm:w-auto" : ""}`} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-card text-text">{nome}</p>
        {children}
      </div>
    </li>
  );
}
