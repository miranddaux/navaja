// Catálogo estático da Entrega 1. Depois as fotos de referência entram em /public/catalogo.
export type Estilo = {
  id: string;
  nome: string;
  descricao: string;
  categoria: "fim-de-ano" | "cortes";
  tom: string; // cor de apoio do cartão (até termos as fotos)
  /** Estilos com simulação por selfie (IA). Os demais só entram nas recomendações por formato de rosto. */
  selfie?: boolean;
};

export const ESTILOS: Estilo[] = [
  { id: "nevou", nome: "Nevou", descricao: "Cabelo platinado total. O visual da virada.", categoria: "fim-de-ano", tom: "#d9d6cf", selfie: true },
  { id: "nevou-barba", nome: "Nevou + barba", descricao: "Platinado combinando com a barba.", categoria: "fim-de-ano", tom: "#c9c4b8", selfie: true },
  { id: "reflexo-alinhado", nome: "Reflexo alinhado", descricao: "Mechas claras com corte bem definido.", categoria: "fim-de-ano", tom: "#b8a98a" },
  { id: "loiro-pivete", nome: "Loiro pivete", descricao: "Loiro marcante, estilo de rua.", categoria: "fim-de-ano", tom: "#c9a24a" },
  { id: "nevou-topete", nome: "Nevou topete", descricao: "Platinado com topo longo e volume.", categoria: "fim-de-ano", tom: "#d2cec4" },
  { id: "buzz-platinado", nome: "Buzz cut platinado", descricao: "Máquina baixa e cor platinada.", categoria: "fim-de-ano", tom: "#e4e1da", selfie: true },
  { id: "degrade", nome: "Degradê", descricao: "Clássico com transição suave.", categoria: "cortes", tom: "#6b5a4a" },
  { id: "degrade-barba", nome: "Degradê + barba", descricao: "Degradê com a barba alinhada.", categoria: "cortes", tom: "#5f4e40" },
  { id: "social", nome: "Social", descricao: "Corte limpo para o dia a dia.", categoria: "cortes", tom: "#58493c" },
  { id: "buzz", nome: "Buzz cut", descricao: "Máquina baixa, zero complicação.", categoria: "cortes", tom: "#4a3f35" },
];

import fotos from "./fotos-catalogo.json";

/** O app só mostra estilos que já têm foto em public/catalogo (lista gerada no build). */
export const temFoto = (id: string) => (fotos as string[]).includes(id);

export type FormatoRosto = "oval" | "quadrado" | "redondo" | "triangular" | "diamante" | "coracao";

export const FORMATOS: { id: FormatoRosto; nome: string }[] = [
  { id: "oval", nome: "Oval" },
  { id: "quadrado", nome: "Quadrado" },
  { id: "redondo", nome: "Redondo" },
  { id: "triangular", nome: "Triangular" },
  { id: "diamante", nome: "Diamante" },
  { id: "coracao", nome: "Coração" },
];

// Sugestões por formato (ponto de partida: validar com os barbeiros e ajustar aqui).
export const SUGESTOES: Record<FormatoRosto, string[]> = {
  oval: ["nevou", "degrade", "social", "reflexo-alinhado"],
  quadrado: ["degrade", "buzz", "nevou-barba", "loiro-pivete"],
  redondo: ["reflexo-alinhado", "degrade", "loiro-pivete", "social"],
  triangular: ["social", "loiro-pivete", "nevou-barba", "reflexo-alinhado"],
  diamante: ["social", "nevou", "reflexo-alinhado", "degrade"],
  coracao: ["social", "nevou-barba", "degrade", "buzz-platinado"],
};

/** Até 4 estilos para o formato: primeiro os sugeridos que têm foto; se faltar, completa com outros que têm foto. */
export function sugestoesComFoto(formato: FormatoRosto, quantidade = 4) {
  const ids = SUGESTOES[formato].filter(temFoto);
  for (const e of ESTILOS) {
    if (ids.length >= quantidade) break;
    if (temFoto(e.id) && !ids.includes(e.id)) ids.push(e.id);
  }
  return ids.slice(0, quantidade).map((id) => ESTILOS.find((e) => e.id === id)!);
}
