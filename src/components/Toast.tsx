"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

type Tipo = "ok" | "erro" | "info";
const Ctx = createContext<(msg: string, tipo?: Tipo) => void>(() => {});
export const useToast = () => useContext(Ctx);

// Feedback imediato e não bloqueante (heurística 1: visibilidade do status do sistema).
export function ToastProvider({ children }: { children: ReactNode }) {
  const [t, setT] = useState<{ msg: string; tipo: Tipo; id: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const mostrar = useCallback((msg: string, tipo: Tipo = "ok") => {
    clearTimeout(timer.current);
    setT({ msg, tipo, id: Date.now() });
    timer.current = setTimeout(() => setT(null), 3500);
  }, []);

  const cor = t?.tipo === "erro" ? "border-error-line bg-error-bg text-error" : t?.tipo === "info" ? "border-line bg-surface text-text" : "border-ok-line bg-ok-bg text-ok";

  return (
    <Ctx.Provider value={mostrar}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-[calc(120px+env(safe-area-inset-bottom))] z-50 flex justify-center md:bottom-8">
        {t && (
          <p key={t.id} className={`pointer-events-auto rounded-md border px-4 py-2 text-body-sm shadow-lg ${cor}`}>
            {t.msg}
          </p>
        )}
      </div>
    </Ctx.Provider>
  );
}
