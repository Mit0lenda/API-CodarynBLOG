# codaryn-blog-views-api

Este projeto fornece um endpoint serverless para registrar e retornar visualizações de cada post do Blog Codaryn, usando Supabase como backend de dados.

## Estrutura
- Endpoint principal: `/api/views/[slug].ts`
- Backend: Supabase
- Deploy: Vercel/Netlify

## Como usar
1. Configure as variáveis de ambiente `SUPABASE_URL` e `SUPABASE_ANON_KEY`.
2. Crie a tabela `post_views` no Supabase conforme instrução no README.
3. Faça deploy do projeto.
4. Use o script sugerido no blog para exibir as visualizações.

Consulte o README.md para detalhes completos.
