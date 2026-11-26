# Prompt para gerar as imagens padrão do catálogo (ChatGPT ou Gemini)

Objetivo: 8 imagens **idênticas** (mesmo manequim, ângulo, fundo e luz), mudando só o cabelo.

## Especificação (todas iguais)
- Quadrada 1:1 → entregar **1080×1080 px**, JPG, até ~200 KB (guarde o original em alta resolução).
- Fundo: cinza escuro neutro nos tons do Navaja (#1C1C1C → #2A2A2A), degradê suave com vinheta leve.
- Manequim: busto fosco **cinza-ardósia de tom médio (#7A7F87)**, sem expressão. O off-white anterior escondia o cabelo platinado; o tom médio contrasta com cabelo claro (platinado, loiro) e com cabelo escuro. Alternativa de marca: argila caramelo fosca (#B07A45) — teste os dois com Nevou + Degradê antes de gerar os 8.
- Luz: principal suave frontal-esquerda + contraluz caramelo discreto (#C4894A) atrás-direita (separa o cabelo do fundo e reforça a marca).
- Ângulo: 3/4 (≈30° para a direita), do peito para cima, com margem ao redor da cabeça.

## Passo 1 — criar o manequim base (sem cabelo). Faça UMA vez.
```
Create a hyper-realistic studio photograph of a minimalist matte mid-tone slate-gray mannequin head-and-shoulders bust (color #7A7F87, smooth ceramic finish, neutral sculpted face, completely bald, no hair), in a 3/4 front view turned about 30 degrees to the right, centered, framed from the chest up with comfortable margin around the head. Seamless neutral dark-gray studio background (soft gradient between #1C1C1C and #2A2A2A with a very subtle vignette). Lighting: large soft key light from front-left, gentle fill, and a subtle warm caramel (#C4894A) rim light from behind-right. The mannequin is a mid-tone gray, clearly darker than platinum or white hair and clearly lighter than dark brown hair, with strong separation from the near-black background. Photorealistic, 85mm lens, shallow depth of field, premium barbershop editorial look, 4K quality. Square 1:1 composition. No text, no logo, no watermark, no hands, no props.
```
Aprove o resultado. Essa imagem é a base de tudo.

## Passo 2 — um cabelo por vez, NO MESMO CHAT, anexando a imagem base
```
Use the attached image as the exact base. Keep the SAME mannequin, SAME pose, SAME camera angle and framing, SAME background, SAME lighting and SAME color grading. Change ONLY the hair to: [CABELO]. Do not alter anything else. Hyper-realistic strand-level hair detail, glossy natural highlights; the hair must stand out clearly against the mannequin and the background. 4K quality. Square 1:1.
```
Troque `[CABELO]` por uma linha abaixo (um pedido por imagem):

| Arquivo | [CABELO] |
|---|---|
| `nevou.jpg` | full icy platinum-blonde bleached hair (near white), short textured top, low taper fade on the sides |
| `nevou-barba.jpg` | full icy platinum-blonde bleached hair, short textured top, low taper fade, plus a short neatly trimmed platinum-blonde beard |
| `reflexo-alinhado.jpg` | dark brown short textured hair with even, aligned light-blonde highlights (uniform foil highlights), low fade on the sides |
| `loiro-pivete.jpg` | warm golden-honey bleached blonde top, medium length textured, skin fade on the sides |
| `buzz-platinado.jpg` | platinum-blonde buzz cut, very short and even all around |
| `degrade.jpg` | natural dark brown hair, classic mid skin fade, short textured top |
| `social.jpg` | natural dark brown classic side-part, short and neat, clean low taper |
| `buzz.jpg` | natural dark brown buzz cut, very short and even all around |

## Dicas de consistência
- Sempre o mesmo chat e sempre anexando a imagem base. Se o manequim "mudar", reanexe a base e repita o pedido.
- Se a luz ou o fundo derivarem, acrescente: "Match the base image exactly; background and lighting must be identical."
- Salve o original, reduza para 1080×1080 e exporte JPG qualidade ~80 (squoosh.app). Nomeie como na tabela e coloque em `public/catalogo`.
