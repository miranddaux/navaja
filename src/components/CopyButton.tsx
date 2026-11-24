"use client";

import { useState } from "react";
import { Button } from "./Button";
import { IconCheck, IconCopiar } from "./Icons";
import { useToast } from "./Toast";

export function CopyButton({ texto, rotulo = "Copiar link" }: { texto: string; rotulo?: string }) {
  const [copiado, setCopiado] = useState(false);
  const toast = useToast();

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      toast("Link copiado!");
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast("Não deu para copiar. Selecione o link e copie manualmente.", "erro");
    }
  }

  return (
    <Button type="button" variant="secondary" size="md" onClick={copiar} className="gap-2 px-4">
      {copiado ? <IconCheck /> : <IconCopiar />}
      {copiado ? "Copiado" : rotulo}
    </Button>
  );
}
