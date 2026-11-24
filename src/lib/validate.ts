// Validações e máscaras usadas nos formulários (rodam enquanto a pessoa digita).

export type Estado = { nivel: "vazio" | "dica" | "erro" | "ok"; msg?: string };

/** "Barbearia do Zé!" -> "barbearia-do-ze" */
export function slugify(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/** Limpa o que a pessoa digita no campo de endereço (sem cortar hífen no meio da digitação). */
export function limparSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+/, "")
    .slice(0, 40);
}

export function validarNome(v: string): Estado {
  const t = v.trim();
  if (!t) return { nivel: "vazio" };
  if (t.length < 2) return { nivel: "dica", msg: "Continue digitando o nome." };
  return { nivel: "ok" };
}

export function validarSlugFormato(v: string): Estado {
  if (!v) return { nivel: "vazio" };
  if (v.length < 3) return { nivel: "dica", msg: `Mais ${3 - v.length} caractere(s) — mínimo 3.` };
  if (v.endsWith("-")) return { nivel: "dica", msg: "O endereço não pode terminar com hífen." };
  return { nivel: "ok" };
}

export function soDigitos(v: string) {
  return v.replace(/\D/g, "");
}

/** 17999998888 -> (17) 99999-8888 */
export function mascaraTelefone(v: string) {
  const d = soDigitos(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function validarTelefone(v: string): Estado {
  const d = soDigitos(v);
  if (!d) return { nivel: "vazio" };
  if (d.length >= 2 && Number(d.slice(0, 2)) < 11) return { nivel: "erro", msg: "DDD inválido. Ex.: 17 para Rio Preto." };
  if (d.length === 11 && d[2] !== "9") return { nivel: "erro", msg: "Celular começa com 9 depois do DDD." };
  if (d.length < 10) return { nivel: "dica", msg: `Faltam ${11 - d.length} número(s) — DDD + celular.` };
  if (d.length === 10) return { nivel: "ok", msg: "Telefone fixo." };
  return { nivel: "ok" };
}

/** Preço: aceita só números e vírgula, 2 casas. "1500" -> "1500", "15,5" -> "15,5" */
export function limparPreco(v: string) {
  const t = v.replace(/[^\d,]/g, "");
  const [inteiro, ...resto] = t.split(",");
  return resto.length ? `${inteiro.slice(0, 5)},${resto.join("").slice(0, 2)}` : inteiro.slice(0, 5);
}

export function validarPreco(v: string): Estado {
  if (!v) return { nivel: "vazio" };
  const n = Number(v.replace(",", "."));
  if (!Number.isFinite(n)) return { nivel: "erro", msg: "Use só números. Ex.: 150 ou 150,50." };
  if (n === 0) return { nivel: "dica", msg: "Preço zero? Deixe em branco se preferir não mostrar." };
  if (n > 5000) return { nivel: "erro", msg: "Esse valor parece alto. Confira." };
  return { nivel: "ok" };
}

export function validarEmail(v: string): Estado {
  const t = v.trim();
  if (!t) return { nivel: "vazio" };
  if (!t.includes("@")) return { nivel: "dica", msg: "Falta o @ do e-mail." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t)) return { nivel: "dica", msg: "Continue: falta o final, como .com" };
  const typo = t.match(/@(gmial|gmai|gamil|hotmial|outlok)\./i);
  if (typo) return { nivel: "erro", msg: "Esse domínio parece digitado errado. Confira." };
  return { nivel: "ok" };
}
