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

export async function gerarImagem(opts: {
  imagemBase64: string;
  mimeType: string;
  estiloNome: string;
}): Promise<{ base64: string; mimeType: string }> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("ia_nao_configurada");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${PROMPT_BASE} Estilo: ${opts.estiloNome}.` },
              { inline_data: { mime_type: opts.mimeType, data: opts.imagemBase64 } },
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
