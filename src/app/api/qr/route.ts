import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";

// QR da barbearia em alta resolução (PNG ou SVG) para a arte do kit físico.
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Entre na sua conta.", { status: 401 });
  const { data: b } = await supabase.from("barbershops").select("slug").maybeSingle();
  if (!b) return new Response("Sem barbearia.", { status: 404 });

  const formato = new URL(request.url).searchParams.get("formato") === "svg" ? "svg" : "png";
  const site = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const alvo = `${site}/b/${b.slug}/nevou`; // nunca aponta direto para imagem
  const opts = { errorCorrectionLevel: "H" as const, margin: 2, color: { dark: "#000000", light: "#ffffff" } };

  if (formato === "svg") {
    const svg = await QRCode.toString(alvo, { ...opts, type: "svg" });
    return new Response(svg, { headers: { "Content-Type": "image/svg+xml", "Content-Disposition": `attachment; filename="qr-${b.slug}.svg"` } });
  }
  const png = await QRCode.toBuffer(alvo, { ...opts, width: 2000 });
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png", "Content-Disposition": `attachment; filename="qr-${b.slug}.png"` } });
}
