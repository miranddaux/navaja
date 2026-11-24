import "server-only";
import { createHash } from "node:crypto";

// A chave da IA fica SÓ no servidor (nunca NEXT_PUBLIC_).
const MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-3.1-flash-image";

export function hashEntrada(imagemBase64: string, estiloId: string) {
  return createHash("sha256").update(estiloId).update(imagemBase64).digest("hex");
}

const PROMPT_BASE =
  "Edite a foto desta pessoa aplicando apenas o estilo de cabelo pedido. " +
  "Mantenha o rosto, a identidade e o tom de pele exatamente iguais. " +
  "Mantenha a textura natural do cabelo (não alise nem altere cachos/crespos). " +
  "Resultado realista, em resolução de celular.";

// Foto de referência do estilo (public/catalogo/<id>.jpg). Se não existir, gera só com o texto.
async function buscarReferencia(estiloId: string): Promise<{ data: string; mime: string } | null> {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (!site) return null;
  try {
    const r = await fetch(`${site}/catalogo/${estiloId}.jpg`, { signal: AbortSignal.timeout(8_000) });
    if (!r.ok || !(r.headers.get("content-type") ?? "").startsWith("image/")) return null;
    return { data: Buffer.from(await r.arrayBuffer()).toString("base64"), mime: "image/jpeg" };
  } catch {
    return null;
  }
}

export async function gerarImagem(opts: {
  imagemBase64: string;
  mimeType: string;
  estiloNome: string;
  estiloId?: string;
}): Promise<{ base64: string; mimeType: string }> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("ia_nao_configurada");

  const ref = opts.estiloId ? await buscarReferencia(opts.estiloId) : null;
  const instrucao = ref
    ? `${PROMPT_BASE} Estilo: ${opts.estiloNome}. A SEGUNDA imagem é só a referência do estilo (cor e corte): não copie o rosto dela.`
    : `${PROMPT_BASE} Estilo: ${opts.estiloNome}.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: instrucao },
              { inline_data: { mime_type: opts.mimeType, data: opts.imagemBase64 } },
              ...(ref ? [{ inline_data: { mime_type: ref.mime, data: ref.data } }] : []),
            ],
          },
        ],
      }),
      signal: AbortSignal.timeout(60_000),
    },
  );
  if (!res.ok) throw new Error(`ia_erro_${res.status}`);
  const json = await res.json();
  const partes = json?.candidates?.[0]?.content?.parts ?? [];
  const img = partes.find((p: { inlineData?: unknown; inline_data?: unknown }) => p.inlineData || p.inline_data);
  const d = img?.inlineData ?? img?.inline_data;
  if (!d?.data) throw new Error("ia_sem_imagem");
  return { base64: d.data, mimeType: d.mimeType ?? d.mime_type ?? "image/png" };
}
