const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function inlineAndExport(html: string): Promise<{ html: string; sizeKB: number; clipped: boolean }> {
  const res = await fetch(`${API_URL}/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html }),
  });
  if (!res.ok) throw new Error('Export failed');
  return res.json();
}

export async function copyForGmail(html: string): Promise<void> {
  const { html: inlined } = await inlineAndExport(html);
  const blob = new Blob([inlined], { type: 'text/html' });
  const item = new ClipboardItem({ 'text/html': blob });
  await navigator.clipboard.write([item]);
}

export async function sendTest(html: string, subject: string, to: string): Promise<void> {
  const res = await fetch(`${API_URL}/send-test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, subject, to }),
  });
  if (!res.ok) throw new Error('Send failed');
}
