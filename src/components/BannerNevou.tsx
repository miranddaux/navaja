// Arte de chamada da Operação Nevou (feita em código: leve, nítida em qualquer tela).
export function BannerNevou({ nome }: { nome: string }) {
  return (
    <section aria-label="Operação Nevou" className="relative overflow-hidden rounded-lg border border-line bg-[linear-gradient(155deg,#34322e_0%,#171615_55%,#0a0a0a_100%)] p-6">
      <svg aria-hidden className="absolute inset-0 size-full">
        <defs>
          <pattern id="neve" width="96" height="96" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="18" r="2.5" fill="#f5f5f5" opacity=".55" />
            <circle cx="58" cy="10" r="1.5" fill="#f5f5f5" opacity=".4" />
            <circle cx="80" cy="44" r="3" fill="#f5f5f5" opacity=".6" />
            <circle cx="34" cy="60" r="1.5" fill="#f5f5f5" opacity=".35" />
            <circle cx="64" cy="84" r="2" fill="#f5f5f5" opacity=".5" />
            <circle cx="8" cy="88" r="1.5" fill="#f5f5f5" opacity=".3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#neve)" />
      </svg>
      <div className="relative flex flex-col gap-4">
        <span className="w-fit rounded-full border border-brand-pressed bg-brand px-3 py-1 text-label text-bg">Operação Nevou · Réveillon</span>
        <div className="flex flex-col gap-2">
          <h1 className="text-display">Vai nevar? <span className="text-brand">Veja antes!</span></h1>
          <p className="text-body-sm text-text-2">Descubra como o platinado fica em você, em 1 minuto, antes de sentar na cadeira da {nome}.</p>
        </div>
      </div>
    </section>
  );
}
