# Migrations

`base_barbearias_creditos_geracoes` (22/11/2026) foi aplicada direto no projeto Supabase `navaja`:
tabelas `barbershops`, `credit_wallets`, `app_settings`, `generations`, RLS em todas e as funções
`iniciar_geracao` (checa login, dono, 10 s, teto diário, saldo e desconta 1 crédito de forma atômica)
e `concluir_geracao` (marca sucesso ou falha; falha devolve o crédito).
Para versionar o SQL completo, rode `supabase db pull` quando instalarmos o Supabase CLI.

`fluxo_cliente_qr` e `whatsapp_da_barbearia` (24/11/2026): colunas `nome`, `quer`, `consentimento_at` em `generations`,
`whatsapp` em `barbershops` e funções públicas `barbearia_publica`, `iniciar_geracao_qr` (1 por WhatsApp, 10/dia por barbearia,
teto global, desconta da cota do barbeiro), `concluir_geracao_qr` (falha devolve crédito e libera o WhatsApp) e `marcar_interesse`.
