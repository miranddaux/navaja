"use client";

import { useState } from "react";

// Foto de referência do estilo. Se o arquivo ainda não existir em /public/catalogo, mostra o degradê.
export function FotoEstilo({ id, tom, className = "" }: { id: string; tom: string; className?: string }) {
  const [ok, setOk] = useState(true);
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: `linear-gradient(160deg, ${tom}, #1c1c1c)` }} aria-hidden>
      {ok && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/catalogo/${id}.jpg`} alt="" loading="lazy" onError={() => setOk(false)} className="absolute inset-0 size-full object-cover" />
      )}
    </div>
  );
}
