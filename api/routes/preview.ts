import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';

export const previewRouter = Router();

function getSupabase() {
  return createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

previewRouter.get('/:token', async (req, res) => {
  const { token } = req.params;
  const supabase = getSupabase();

  const { data, error } = await supabase.from('preview_tokens')
    .select('email_id, expires_at, view_count, emails(subject, blocks_jsonb)')
    .eq('token', token)
    .single();

  if (error || !data) {
    res.status(404).send('Preview not found');
    return;
  }

  if (new Date(data.expires_at) < new Date()) {
    res.status(410).send('Preview link expired');
    return;
  }

  await supabase.from('preview_tokens')
    .update({ view_count: ((data as any).view_count ?? 0) + 1 })
    .eq('token', token);

  res.json({ email: data.emails, token });
});
