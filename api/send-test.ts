import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import juice from 'juice';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { html, subject, to } = req.body as { html: string; subject: string; to: string };
  if (!html || !subject || !to) {
    res.status(400).json({ error: 'html, subject, and to are required' });
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const inlined = juice(html);

  const { data, error } = await resend.emails.send({
    from: 'Kore Email Builder <onboarding@resend.dev>',
    to,
    subject: `[TEST] ${subject}`,
    html: inlined,
  });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ id: data?.id });
}
