import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";

// QR da barbearia em alta resolução (PNG ou SVG) para a arte do kit físico.
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Entre na sua conta.", { status: 401 });
  // O dono da plataforma pode pedir o QR de qualquer barbearia pelo endereço (?slug=); o barbeiro só o dele.
  const pedido = new URL(request.url).searchParams.get("slug");
  let slug: string | null = null;
  if (pedido) {
    const { data: ehDono } = await supabase.rpc("eh_dono");
    if (!ehDono || !/^[a-z0-9-]{3,40}$/.test(pedido)) return new Response("Sem permissão.", { status: 403 });
    slug = pedido;
  } else {
    const { data: b } = await supabase.from("barbershops").select("slug").maybeSingle();
    slug = b?.slug ?? null;
  }
  if (!slug) return new Response("Sem barbearia.", { status: 404 });

  const formato = new URL(request.url).searchParams.get("formato") === "svg" ? "svg" : "png";
  const site = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const alvo = `${site}/b/${slug}/nevou`; // nunca aponta direto para imagem
  const opts = { errorCorrectionLevel: "H" as const, margin: 2, color: { dark: "#000000", light: "#ffffff" } };

  if (formato === "svg") {
    const svg = await QRCode.toString(alvo, { ...opts, type: "svg" });
    return new Response(svg, { headers: { "Content-Type": "image/svg+xml", "Content-Disposition": `attachment; filename="qr-${slug}.svg"` } });
  }
  const png = await QRCode.toBuffer(alvo, { ...opts, width: 2000 });
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png", "Content-Disposition": `attachment; filename="qr-${slug}.png"` } });
}
