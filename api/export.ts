import type { VercelRequest, VercelResponse } from '@vercel/node';
import juice from 'juice';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { html } = req.body as { html: string };
  if (!html) {
    res.status(400).json({ error: 'html required' });
    return;
  }

  const inlined = juice(html, {
    removeStyleTags: false,
    applyStyleTags: true,
    preserveImportant: true,
  });

  const sizeBytes = Buffer.byteLength(inlined, 'utf8');
  const sizeKB = Math.round(sizeBytes / 1024);
  const clipped = sizeKB > 102;

  res.json({ html: inlined, sizeKB, clipped });
}
