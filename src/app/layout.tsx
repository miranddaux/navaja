import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Big_Shoulders } from "next/font/google";
import "./globals.css";

const cabinet = localFont({
  variable: "--font-cabinet",
  display: "swap",
  src: [
    { path: "../fonts/CabinetGrotesk-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/CabinetGrotesk-Medium.otf", weight: "500", style: "normal" },
    { path: "../fonts/CabinetGrotesk-Bold.otf", weight: "700", style: "normal" },
  ],
});

// Fonte de destaque (títulos grandes) do Figma.
const display = Big_Shoulders({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Navaja",
  description: "Agenda, financeiro e prova virtual de corte e cor para barbeiros.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${cabinet.variable} ${display.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
