"use client";

import { Button } from "./Button";

export function PrintButton() {
  return <Button type="button" onClick={() => window.print()} className="px-8">Imprimir ou salvar em PDF</Button>;
}
