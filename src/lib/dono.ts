export type BarbeariaDono = {
  id: string; nome: string; slug: string; email: string; criada: string;
  saldo: number | null; cota: number | null; sims_mes: number; quer_mes: number;
};
export type PainelDono = {
  teto: number; custo_centavos: number; hoje: number; mes: number; falhas_mes: number; barbearias: BarbeariaDono[];
};
