import { supabase } from './supabase';

export async function createPreviewToken(emailId: string): Promise<string> {
  const { data, error } = await supabase.from('preview_tokens')
    .insert({ email_id: emailId })
    .select('token').single();
  if (error) throw error;
  return data.token;
}

export async function getPreviewUrl(emailId: string): Promise<string> {
  const token = await createPreviewToken(emailId);
  return `${window.location.origin}/preview/${token}`;
}
