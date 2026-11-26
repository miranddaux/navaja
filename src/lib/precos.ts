import { ESTILOS } from "./catalog";

export type Precos = Record<string, number>;

/** Lê os campos preco_<id> do formulário. Vazio = sem preço. Retorna erro se houver valor inválido. */
export function lerPrecos(fd: FormData): { precos: Precos; erro?: string } {
  const precos: Precos = {};
  for (const e of ESTILOS) {
    const bruto = String(fd.get(`preco_${e.id}`) ?? "").trim().replace(",", ".");
    if (!bruto) continue;
    const n = Number(bruto);
    if (!Number.isFinite(n) || n <= 0 || n > 5000) return { precos, erro: `Confira o valor de "${e.nome}".` };
    precos[e.id] = Math.round(n * 100) / 100;
  }
  return { precos };
}

export const brl = (n: number) => `R$ ${n.toFixed(2).replace(".", ",")}`;
