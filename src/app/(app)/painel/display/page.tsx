import { Suspense } from "react";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { ArteDisplay } from "@/components/ArteDisplay";
import { ButtonLink } from "@/components/Button";
import { PrintButton } from "@/components/PrintButton";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Arte do display · Navaja" };

export default function DisplayPage() {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <Display />
    </Suspense>
  );
}

async function Display() {
  const supabase = await createClient();
  const { data: b } = await supabase.from("barbershops").select("name, slug").maybeSingle();
  if (!b) redirect("/barbearia/nova");

  const link = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/b/${b.slug}/nevou`;
  const qr = await QRCode.toString(link, { type: "svg", margin: 0, errorCorrectionLevel: "H", color: { dark: "#0a0a0a", light: "#ffffff" } });

  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-4 pt-8 md:px-8 md:pt-12 print:max-w-none print:p-0">
      <header className="flex flex-col gap-2 print:hidden">
        <h1 className="text-h1">Arte do display (A6)</h1>
        <p className="text-body text-text-2">Pronta para imprimir em 10,5 × 14,8 cm. Use papel fotográfico ou couchê fosco, a 100% (sem ajustar à página).</p>
      </header>

      <div className="mx-auto w-full max-w-[420px] print:max-w-none">
        <ArteDisplay nome={b.name} qr={qr} />
      </div>

      <div className="flex flex-wrap justify-center gap-2 print:hidden">
        <PrintButton />
        <ButtonLink href="/painel" variant="ghost" size="md" className="px-4">Voltar ao painel</ButtonLink>
      </div>
    </main>
  );
}
