# Migrations

`base_barbearias_creditos_geracoes` (22/11/2026) foi aplicada direto no projeto Supabase `navaja`:
tabelas `barbershops`, `credit_wallets`, `app_settings`, `generations`, RLS em todas e as funções
`iniciar_geracao` (checa login, dono, 10 s, teto diário, saldo e desconta 1 crédito de forma atômica)
e `concluir_geracao` (marca sucesso ou falha; falha devolve o crédito).
Para versionar o SQL completo, rode `supabase db pull` quando instalarmos o Supabase CLI.
