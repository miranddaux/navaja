import type { ReactNode } from "react";
import { FotoEstilo } from "./FotoEstilo";

// Cartão de estilo (Figma: card-estilo): fundo surface-1, foto quadrada com raio 8 e nome (14px) embaixo.
export function CardEstilo({ id, tom, nome, children }: { id: string; tom: string; nome: string; children?: ReactNode }) {
  return (
    <li className="flex flex-col gap-2 rounded-md bg-surface-1 p-3">
      <FotoEstilo id={id} tom={tom} className="aspect-square rounded-sm" />
      <div className="flex flex-col gap-1">
        <p className="text-card text-text">{nome}</p>
        {children}
      </div>
    </li>
  );
}

// Preenche o espaço quando a quantidade de estilos com foto é ímpar (até a próxima foto chegar).
export function CardEmBreve() {
  return (
    <li aria-hidden className="flex flex-col items-center justify-center gap-1 rounded-md border border-dashed border-line p-3 text-center">
      <p className="text-card text-text-2">Novo estilo</p>
      <p className="text-caption text-text-off">em breve</p>
    </li>
  );
}
