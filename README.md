# codaryn-blog-views-api

API serverless para contagem de visualizações de posts do blog Codaryn, usando Supabase como backend.

## Endpoint

`GET /api/views/[slug]`

### Parâmetros
- `slug` (string): identificador único do post. Apenas letras, números, hífen e underline, entre 3 e 64 caracteres.

### Resposta
```json
{
  "success": true,
  "slug": "meu-post",
  "views": 42
}
```
Em caso de erro:
```json
{
  "success": false,
  "error": "Mensagem do erro"
}
```

### Exemplo de uso no HTML do blog
```html
<span id="views-count">Carregando...</span>
<script>
  const slug = 'meu-post';
  fetch(`https://api-codaryn-blog.vercel.app/api/views/${slug}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('views-count').textContent = `👁️ ${data.views} visualizações`;
    })
    .catch(() => {
      document.getElementById('views-count').textContent = 'Erro ao carregar views';
    });
</script>
```

## Monitoramento

- **Vercel Analytics:**
  - Acesse o painel do projeto na Vercel e clique em "Analytics" para ver estatísticas de acesso, tempo de resposta e erros.
  - Use a aba "Logs" para visualizar erros detalhados das funções serverless.

- **Supabase Logs:**
  - No painel do Supabase, acesse "Logs" para monitorar queries, inserts, updates e possíveis erros no banco.
  - Use "Table Editor" para visualizar e editar os dados da tabela `post_views`.

## Segurança e Limites
- Apenas método GET é permitido.
- Slug validado para evitar entradas inválidas.
- Para limitar abusos, implemente rate limit usando cache externo (Redis, etc) se necessário.

## Deploy
- Configure as variáveis de ambiente `SUPABASE_URL` e `SUPABASE_ANON_KEY` na Vercel.
- O endpoint está pronto para uso em produção.

---
Dúvidas ou sugestões? Abra uma issue ou entre em contato!
