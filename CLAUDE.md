# Navaja — contexto para o Claude Code

Handoff completo (PDF): `docs/navaja-contexto.pdf`. Resumo:

**O que é:** PWA para barbeiros — agenda, financeiro simples e prova virtual de corte e cor com IA. Barbeiro usa app instalado; cliente usa link no navegador. Foco: barbearias da Zona Norte de São José do Rio Preto (SP). Porta de entrada (dez/2026): "Operação Nevou".
**Design:** Figma https://www.figma.com/design/QhJkABBJzXxZxJCfdd0wbJ/ (Fase 7 > UI Final, 8 telas MVP). Escuro e premium, destaque caramelo, grid de 8 pt.

**Sobre o dono:** Miranda, designer de produto, iniciante em programação, Windows + VS Code. Explique em linguagem simples, diga sempre o próximo passo, prefira soluções simples e estáveis.

**Regras de negócio:**
1. Custo só sobe quando a receita sobe (planos gratuitos até haver pagantes).
2. Nunca guardar dados de cartão (só token/ID via Asaas).
3. IA com travas: chave só no servidor; geração = checa login → checa saldo → desconta 1 crédito (transação atômica) → gera → se falhar, devolve o crédito; cota por plano, teto diário global (env), 1 geração/10 s por barbeiro; QR do cliente: 1 simulação por WhatsApp, máx. 10/dia por barbearia; cache por hash (foto + estilo); imagens em resolução de celular.
4. LGPD: consentimento antes da foto; foto original apagada logo após gerar; imagem gerada expira em 30 dias salvo se salva no perfil; sempre existe caminho sem foto.
5. Cabelo crespo/cacheado: referência da mesma textura + instrução fixa + conferência automática + 1 nova tentativa grátis; rótulo "simulação".
6. Agendamento: sem dois clientes no mesmo horário — constraint de exclusão no banco.

**Stack:** Next.js (App Router, TS) na Netlify (não Vercel Hobby); Supabase (Auth, Postgres, Storage, Edge Functions, RLS em todas as tabelas); backup diário via GitHub Action + pg_dump; IA: Gemini 3.1 Flash (Lite) Image (reserva FLUX.1 Kontext Pro); MediaPipe Face Landmarker no navegador; Asaas p/ cobrança; WhatsApp via link wa.me; Resend (e-mail); Sentry.

**Entrega 1 — Demo (até ~10/12/2026):** login do barbeiro + cadastro da barbearia; catálogo "Fim de Ano" e "Cortes"; prova virtual; QR code por barbearia (`/b/[slug]/nevou`); painel do barbeiro; créditos; painel do dono.
**Entrega 2 — MVP (até 25/01/2027):** agenda, financeiro, assinatura Asaas etc.

**Planos:** Estilo 29,90/299 (30 provas) · Essencial 49,90/499 (30) · Pro 79,90/799 (100) · Pacote extra 19,90 (+50). Fundadores (10 primeiros): Essencial a 29,90.

**Fora do escopo:** app nas lojas, multi-barbeiro, estoque, comissões, nota fiscal, Instagram, marketplace.

**Primeira tarefa:** projeto Next.js + Supabase, tela de login e tela "Fim de Ano" com catálogo estático, publicar na Netlify. Depois, a rota de servidor da prova virtual com as travas de crédito.
