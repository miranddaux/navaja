// Foto de referência do estilo (public/catalogo/<id>.jpg) sobre um degradê de cor.
// Como são camadas de fundo, se o arquivo ainda não existir o navegador mostra só o degradê
// (sem ícone de imagem quebrada e sem depender de JavaScript).
export function FotoEstilo({ id, tom, className = "" }: { id: string; tom: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={`bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(/catalogo/${id}.jpg), linear-gradient(160deg, ${tom}, #1c1c1c)` }}
    />
  );
}
