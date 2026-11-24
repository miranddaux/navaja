// Esqueleto enquanto a tela carrega (o app responde na hora, sem tela em branco).
export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-4 pt-8 md:px-8" aria-busy="true" aria-label="Carregando">
      <div className="flex flex-col gap-2">
        <div className="h-8 w-2/3 max-w-[320px] animate-pulse rounded-sm bg-surface" />
        <div className="h-4 w-1/2 max-w-[240px] animate-pulse rounded-sm bg-surface" />
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
        {[0, 1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-md bg-surface" />)}
      </div>
      <div className="h-40 animate-pulse rounded-md bg-surface" />
    </main>
  );
}
