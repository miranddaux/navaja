// Monta links do WhatsApp (wa.me exige o código do país). Aceita número com ou sem 55.
export const waNumero = (n: string) => {
  const d = n.replace(/\D/g, "");
  return d.length <= 11 ? `55${d}` : d;
};
export const waLink = (numero: string, texto?: string) =>
  `https://wa.me/${waNumero(numero)}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;
