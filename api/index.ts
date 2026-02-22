import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { previewRouter } from './routes/preview';
import { respondRouter } from './routes/respond';
import { exportRouter } from './routes/export';
import { sendTestRouter } from './routes/send-test';

dotenv.config({ path: '../.env' });

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://kore-email-builder.vercel.app'],
}));
app.use(express.json({ limit: '10mb' }));

app.use('/preview', previewRouter);
app.use('/r', respondRouter);
app.use('/export', exportRouter);
app.use('/send-test', sendTestRouter);

app.get('/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Kore Email Builder API running on port ${PORT}`);
});
