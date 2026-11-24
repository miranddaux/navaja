import { Suspense, type ReactNode } from "react";
import { AppChrome } from "@/components/AppChrome";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <AppChrome>{children}</AppChrome>
    </Suspense>
  );
}
