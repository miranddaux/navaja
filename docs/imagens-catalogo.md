# Imagens do catálogo e Gemini — como funciona

## Onde ficam as fotos de referência
`public/catalogo/<id-do-estilo>.jpg` — 8 arquivos, nomes exatos:

| Arquivo | Estilo |
|---|---|
| `nevou.jpg` | Nevou |
| `nevou-barba.jpg` | Nevou + barba |
| `reflexo-alinhado.jpg` | Reflexo alinhado |
| `loiro-pivete.jpg` | Loiro pivete |
| `buzz-platinado.jpg` | Buzz cut platinado |
| `degrade.jpg` | Degradê |
| `social.jpg` | Social |
| `buzz.jpg` | Buzz cut |

Formato: JPG quadrado **1080×1080 px**, até ~200 KB (guarde o original em alta resolução fora do projeto). Mesmo manequim, mesmo fundo e mesma luz em todas; só o cabelo muda. Veja o prompt completo em `docs/prompt-imagens-padrao.md`.
Sem o arquivo, o app mostra o degradê de cor (nada quebra). Com o arquivo, ele aparece sozinho no catálogo,
nas sugestões "sem foto" e é enviado ao Gemini como referência do estilo.

## Como o Gemini usa isso
Envio = [instrução fixa] + [selfie do cliente] + [foto de referência do estilo].
A instrução manda manter rosto, identidade, tom de pele e textura natural do cabelo, e usar a 2ª imagem só como referência de cor e corte.
Código: `src/lib/ai.ts`. Chave: `GEMINI_API_KEY` (só no servidor). Modelo: `GEMINI_IMAGE_MODEL`.

## Prompt-base para gerar as 8 fotos de referência
"Retrato masculino, 4:5, busto, olhando para a câmera, fundo cinza-escuro liso, luz de estúdio suave,
fotografia realista. Cabelo: <ESTILO>. Sem texto, sem marca d'água."
Troque <ESTILO> pelo estilo (ex.: "platinado total, corte social baixo"). Gere 3 variações de cada e escolha a melhor.
Depois (v1.1): uma foto por textura de cabelo (liso, ondulado, cacheado, crespo) para a regra de cabelo crespo/cacheado.
