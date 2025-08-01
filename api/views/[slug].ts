import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req: any, res: any) {
  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: 'Slug obrigatório' });

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
      const { error: insertError } = await supabase
        .from('post_views')
        .insert({ slug, count: newCount });
      if (insertError) throw insertError;
    }
    res.status(200).json({ views: newCount });
  } catch (error: any) {
    res.status(500).json({ error: error.message || error.toString() });
  }
}
