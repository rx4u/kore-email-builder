import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }),
    },
    from: vi.fn(),
  },
}));

import { supabase } from './supabase';
import { saveDraft, listDrafts, deleteDraft } from './drafts';

const mockSupabaseFrom = (returnVal: unknown) => {
  const chain = {
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue(returnVal),
    single: vi.fn().mockResolvedValue(returnVal),
  };
  vi.mocked(supabase.from).mockReturnValue(chain as any);
  return chain;
};

describe('drafts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('saveDraft with no id creates new draft and returns id', async () => {
    const chain = mockSupabaseFrom({ data: { id: 'new-id' }, error: null });
    chain.insert.mockReturnValue(chain);
    chain.select.mockReturnValue(chain);
    chain.single.mockResolvedValue({ data: { id: 'new-id' }, error: null });

    const id = await saveDraft(null, 'Test Email', []);
    expect(id).toBe('new-id');
  });

  it('saveDraft with existing id updates and returns same id', async () => {
    const chain = mockSupabaseFrom({ data: null, error: null });
    chain.update.mockReturnValue(chain);
    chain.eq.mockResolvedValue({ error: null });

    const id = await saveDraft('existing-id', 'Test Email', []);
    expect(id).toBe('existing-id');
  });

  it('listDrafts returns array', async () => {
    mockSupabaseFrom({ data: [{ id: '1', subject: 'Test' }], error: null });

    const drafts = await listDrafts();
    expect(Array.isArray(drafts)).toBe(true);
  });

  it('saveDraft throws when not authenticated', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({ data: { user: null } } as any);
    await expect(saveDraft(null, 'Test', [])).rejects.toThrow('Not authenticated');
  });
});
