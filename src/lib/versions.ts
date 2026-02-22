import { supabase } from './supabase';

export async function saveVersion(emailId: string, blocks: unknown, label?: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from('email_versions').insert({
    email_id: emailId,
    blocks_jsonb: blocks,
    saved_by: user?.id ?? null,
    label: label ?? null,
  });
  if (error) throw error;
}

export async function listVersions(emailId: string) {
  const { data, error } = await supabase.from('email_versions')
    .select('id, label, created_at, saved_by')
    .eq('email_id', emailId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

export async function restoreVersion(versionId: string): Promise<unknown> {
  const { data, error } = await supabase.from('email_versions')
    .select('blocks_jsonb')
    .eq('id', versionId)
    .single();
  if (error) throw error;
  return data.blocks_jsonb;
}
