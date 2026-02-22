import { Router } from 'express';
import juice from 'juice';

export const exportRouter = Router();

exportRouter.post('/', (req, res) => {
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
});
