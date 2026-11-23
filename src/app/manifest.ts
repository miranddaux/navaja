import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Navaja",
    short_name: "Navaja",
    description: "Agenda, financeiro e prova virtual para barbeiros.",
    start_url: "/fim-de-ano",
    display: "standalone",
    background_color: "#0e0d0c",
    theme_color: "#0e0d0c",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
