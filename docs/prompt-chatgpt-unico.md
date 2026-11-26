# Prompt único para o ChatGPT (copie tudo, anexe o manequim claro e envie)

Anexe junto: `docs/manequim-base.jpg` (manequim claro, careca).

```
You are my image production assistant for a barbershop app. I attached a BASE image: a matte off-white mannequin bust, bald, 3/4 view, near-black studio background, soft key light and a subtle warm caramel rim light.

GOAL: produce 6 new square images (1:1, 1080x1080) that are IDENTICAL to the base in everything except hair (and, for 5 of them, the mannequin color). Consistency is the top priority: same sculpture, same pose, same camera angle and framing, same background, same lighting and color grading, same crop. Hyper-realistic, strand-level hair detail, glossy natural highlights, premium barbershop editorial look, 4K quality. No text, no logo, no watermark, no props.

CONTRAST RULE (very important): the hair must always stand out from the mannequin.
- Images with LIGHT hair (platinum/blonde/highlights) use a DARK mannequin: matte dark slate-gray (#5B6068), clearly lighter than the near-black background and clearly darker than the hair.
- Images with DARK hair use the ORIGINAL light mannequin (off-white #E8E4DC).

PROCESS:
1. First create the DARK mannequin base: use the attached image as the exact base and change ONLY the mannequin material color to matte dark slate-gray (#5B6068), still bald. Show it to me, then reuse it (exactly the same image) as the base for images 1 to 5 below.
2. Then generate the 6 images ONE PER MESSAGE, in this order, without asking me questions. Each one must start from the correct base (dark base for 1-5, original light base for 6), keeping everything identical and changing ONLY the hair:

1) nevou: full icy platinum-blonde bleached hair (near white), short textured top, low taper fade on the sides. [DARK mannequin]
2) nevou-barba: full icy platinum-blonde bleached hair, short textured top, low taper fade, plus a short neatly trimmed beard in the same platinum-blonde color. [DARK mannequin]
3) buzz-platinado: platinum-blonde buzz cut, very short and even all around. [DARK mannequin]
4) reflexo-alinhado: dark brown short textured hair with even, aligned light-blonde highlights (uniform foil highlights), low fade on the sides. [DARK mannequin]
5) loiro-pivete: warm golden-honey bleached blonde top, medium length textured, skin fade on the sides. [DARK mannequin]
6) social: natural dark brown classic side-part, short and neat, clean low taper. [LIGHT original mannequin]

After each image, tell me the file name (for example "nevou") and wait for me to say "next" only if you cannot continue on your own. If any image drifts (different mannequin, angle, background or light), regenerate it from the base before showing me.
```

## Depois de gerar
1. Baixe cada imagem. Reduza para **1080×1080** e exporte JPG qualidade ~80 (squoosh.app), até ~200 KB.
2. Nomeie: `nevou.jpg`, `nevou-barba.jpg`, `buzz-platinado.jpg`, `reflexo-alinhado.jpg`, `loiro-pivete.jpg`, `social.jpg`.
3. Mande aqui no chat (ou coloque em `public/catalogo`). O app já usa os nomes sozinho.
4. `nevou` e `buzz-platinado` substituem as versões atuais (que estão no manequim claro).

---

# Prompt para as 3 imagens que ainda faltam (use no MESMO chat das anteriores)

Já existem: nevou, nevou-barba, buzz-platinado, loiro-pivete, social, degrade e buzz.
Faltam 3 para completar o catálogo (com elas, as duas abas ficam com número par de cartões):

```
Using the same two base images from this conversation (dark slate mannequin base and original light mannequin base), generate 3 more images, ONE PER MESSAGE, keeping EVERYTHING identical (same mannequin, pose, camera angle, framing, background, lighting, color grading, 1:1 square) and changing ONLY the hair:

1) reflexo-alinhado [DARK mannequin]: dark chocolate-brown short textured hair with strong, even, aligned light-blonde highlights (uniform foil highlights clearly visible), low fade on the sides. The highlights must stand out clearly against the dark base hair and the mannequin.
2) nevou-topete [DARK mannequin]: full icy platinum-blonde bleached hair (near white), longer textured top styled up and back into a voluminous quiff, low taper fade on the sides.
3) degrade-barba [LIGHT mannequin]: natural dark brown short textured top with a mid skin fade on the sides, plus a short, neatly lined-up dark brown beard.

After each image, tell me the file name. If any image drifts from the base, regenerate it before showing me.
```

Arquivos: `reflexo-alinhado.jpg`, `nevou-topete.jpg`, `degrade-barba.jpg` (1080×1080, JPG ~80).
O app só mostra um estilo quando a foto dele existe, então pode mandar uma de cada vez.
