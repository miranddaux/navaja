// Catálogo estático da Entrega 1. Depois as fotos de referência entram em /public/catalogo.
export type Estilo = {
  id: string;
  nome: string;
  descricao: string;
  categoria: "fim-de-ano" | "cortes";
  tom: string; // cor de apoio do cartão (até termos as fotos)
};

export const ESTILOS: Estilo[] = [
  { id: "nevou", nome: "Nevou", descricao: "Cabelo platinado total. O visual da virada.", categoria: "fim-de-ano", tom: "#d9d6cf" },
  { id: "nevou-barba", nome: "Nevou + barba", descricao: "Platinado combinando com a barba.", categoria: "fim-de-ano", tom: "#c9c4b8" },
  { id: "reflexo-alinhado", nome: "Reflexo alinhado", descricao: "Mechas claras com corte bem definido.", categoria: "fim-de-ano", tom: "#b8a98a" },
  { id: "loiro-pivete", nome: "Loiro pivete", descricao: "Loiro marcante, estilo de rua.", categoria: "fim-de-ano", tom: "#c9a24a" },
  { id: "buzz-platinado", nome: "Buzz cut platinado", descricao: "Máquina baixa e cor platinada.", categoria: "fim-de-ano", tom: "#e4e1da" },
  { id: "degrade", nome: "Degradê", descricao: "Clássico com transição suave.", categoria: "cortes", tom: "#6b5a4a" },
  { id: "social", nome: "Social", descricao: "Corte limpo para o dia a dia.", categoria: "cortes", tom: "#58493c" },
  { id: "buzz", nome: "Buzz cut", descricao: "Máquina baixa, zero complicação.", categoria: "cortes", tom: "#4a3f35" },
];

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
  oval: ["nevou", "nevou-barba", "reflexo-alinhado"],
  quadrado: ["nevou", "loiro-pivete", "buzz-platinado"],
  redondo: ["reflexo-alinhado", "nevou", "loiro-pivete"],
  triangular: ["nevou-barba", "reflexo-alinhado", "loiro-pivete"],
  diamante: ["nevou", "reflexo-alinhado", "nevou-barba"],
  coracao: ["nevou-barba", "buzz-platinado", "nevou"],
};
