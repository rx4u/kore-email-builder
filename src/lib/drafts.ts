import { supabase } from './supabase';

const WORKSPACE_ID = '00000000-0000-0000-0000-000000000001';

export async function saveDraft(emailId: string | null, subject: string, blocks: unknown): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  if (emailId) {
    const { error } = await supabase.from('emails').update({
      subject,
      blocks_jsonb: blocks,
      updated_at: new Date().toISOString(),
    }).eq('id', emailId);
    if (error) throw error;
    return emailId;
  } else {
    const { data, error } = await supabase.from('emails').insert({
      workspace_id: WORKSPACE_ID,
      author_id: user.id,
      subject,
      blocks_jsonb: blocks,
    }).select('id').single();
    if (error) throw error;
    return data.id as string;
  }
}

export async function loadDraft(emailId: string) {
  const { data, error } = await supabase.from('emails')
    .select('*').eq('id', emailId).single();
  if (error) throw error;
  return data;
}

export async function listDrafts() {
  const { data, error } = await supabase.from('emails')
    .select('id, subject, status, updated_at, author_id')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function deleteDraft(emailId: string) {
  const { error } = await supabase.from('emails').delete().eq('id', emailId);
  if (error) throw error;
}

export async function updateDraftStatus(emailId: string, status: 'draft' | 'in_review' | 'approved' | 'sent') {
  const { error } = await supabase.from('emails')
    .update({ status }).eq('id', emailId);
  if (error) throw error;
}
