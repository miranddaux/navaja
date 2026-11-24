// Barra de progresso acessível (uso de créditos, teto diário…).
export function Progress({ valor, max, rotulo, perigo = 0.9 }: { valor: number; max: number; rotulo: string; perigo?: number }) {
  const pct = max > 0 ? Math.min(100, Math.round((valor / max) * 100)) : 0;
  const alerta = max > 0 && valor / max >= perigo;
  return (
    <div role="progressbar" aria-label={rotulo} aria-valuemin={0} aria-valuemax={max} aria-valuenow={valor} className="h-2 w-full overflow-hidden rounded-full bg-surface-3">
      <div className={`h-full rounded-full transition-all ${alerta ? "bg-error" : "bg-brand"}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
