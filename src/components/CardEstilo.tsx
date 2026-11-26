import type { ReactNode } from "react";
import { FotoEstilo } from "./FotoEstilo";

// Cartão de estilo (Figma: card-estilo): fundo surface-1, foto quadrada com raio 8 e nome embaixo.
export function CardEstilo({ id, tom, nome, children }: { id: string; tom: string; nome: string; children?: ReactNode }) {
  return (
    <li className="flex flex-col gap-2 rounded-md bg-surface-1 p-3">
      <FotoEstilo id={id} tom={tom} className="aspect-square rounded-sm" />
      <p className="text-label text-text">{nome}</p>
      {children}
    </li>
  );
}
