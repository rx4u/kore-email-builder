import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('inlineAndExport', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ html: '<inlined>', sizeKB: 12, clipped: false }),
    }));
  });

  it('returns inlined html and size', async () => {
    const { inlineAndExport } = await import('./export');
    const result = await inlineAndExport('<div>test</div>');
    expect(result.html).toBe('<inlined>');
    expect(result.sizeKB).toBe(12);
    expect(result.clipped).toBe(false);
  });

  it('throws when response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    const { inlineAndExport } = await import('./export');
    await expect(inlineAndExport('<div>test</div>')).rejects.toThrow('Export failed');
  });
});
