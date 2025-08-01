import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);


export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Permitir apenas método GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, error: 'Método não permitido' });
  }

  // Rate limit simples por IP (apenas para exemplo, não seguro para produção)
  // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  // Aqui você pode implementar um controle usando cache externo (Redis, etc)

  const { slug } = req.query;
  // Validação extra de slug: só letras, números, hífen, underline, 3-64 caracteres
  if (!slug || typeof slug !== 'string' || !/^[a-zA-Z0-9_-]{3,64}$/.test(slug)) {
    return res.status(400).json({ success: false, error: 'Slug inválido' });
  }

  try {
    // Busca o registro atual
    const { data: existing, error: fetchError } = await supabase
      .from('post_views')
      .select('count')
      .eq('slug', slug)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    let newCount = 1;
    if (existing && typeof existing.count === 'number') {
      newCount = existing.count + 1;
      const { error: updateError } = await supabase
        .from('post_views')
        .update({ count: newCount })
        .eq('slug', slug);
      if (updateError) throw updateError;
    } else {
      const { error: upsertError } = await supabase
        .from('post_views')
        .upsert({ slug, count: newCount });
      if (upsertError) throw upsertError;
    }
    // Log de acesso bem-sucedido
    await supabase
      .from('api_logs')
      .insert({
        timestamp: new Date().toISOString(),
        slug,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || null,
        status: 'success',
        error: null
      });
    res.status(200).json({ success: true, slug, views: newCount });
  } catch (error: any) {
    // Log de erro
    await supabase
      .from('api_logs')
      .insert({
        timestamp: new Date().toISOString(),
        slug,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || null,
        status: 'error',
        error: error.message || error.toString()
      });
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }
    res.status(500).json({ success: false, error: error.message || error.toString() });
  }
}
