// Lista as fotos que existem em public/catalogo para o app só mostrar estilos com foto.
import { readdirSync, writeFileSync, existsSync } from "node:fs";
const dir = "public/catalogo";
const ids = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".jpg")).map((f) => f.replace(/\.jpg$/, "")).sort() : [];
writeFileSync("src/lib/fotos-catalogo.json", JSON.stringify(ids, null, 2) + "\n");
console.log("fotos-catalogo:", ids.join(", ") || "(nenhuma)");
