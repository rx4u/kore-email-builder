import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { token, blockId, value } = req.query as { token: string; blockId: string; value: string };
  const supabase = getSupabase();

  const { error: insertError } = await supabase.from('responses').insert({
    block_id: blockId,
    recipient_token: token,
    response_type: 'poll',
    value,
  });

  if (insertError && insertError.code !== '23505') {
    res.status(500).send('Error recording response');
    return;
  }

  res.send(`<!DOCTYPE html>
<html>
<head><title>Response recorded</title>
<style>
  body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #09090b; color: #f4f4f5; }
  .card { text-align: center; padding: 40px; }
  h2 { margin: 0 0 8px; font-size: 24px; }
  p { color: #71717a; margin: 0; }
</style>
</head>
<body>
  <div class="card">
    <h2>Thanks!</h2>
    <p>Your response has been recorded.</p>
  </div>
</body>
</html>`);
}
