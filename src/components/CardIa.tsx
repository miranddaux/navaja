import { ButtonLink } from "./Button";

// Destaque da prova virtual (Figma: card-ia): degradê escuro → caramelo, título em fonte display.
export function CardIa({ href }: { href: string }) {
  return (
    <section
      aria-label="Prova virtual"
      className="flex flex-col items-center gap-4 rounded-lg px-4 py-6 text-center"
      style={{ backgroundImage: "linear-gradient(180deg, #0a0a0a 40%, #c4894a 212%), linear-gradient(90deg, #111, #111)" }}
    >
      <div className="flex flex-col items-center gap-1">
        <h2 className="uppercase text-[24px] leading-[1.1] tracking-[-0.01em]" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
          Prova virtual com IA
        </h2>
        <p className="max-w-[240px] text-body-sm text-[rgba(245,245,245,0.9)]">Mostre ao cliente como o Nevou fica nele, na hora.</p>
      </div>
      <ButtonLink href={href} size="sm" className="w-full" target="_blank">Abrir prova virtual</ButtonLink>
    </section>
  );
}
