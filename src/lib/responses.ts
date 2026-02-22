import { supabase } from './supabase';

export async function getResponses(emailId: string) {
  const { data, error } = await supabase.from('responses')
    .select('*').eq('email_id', emailId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export function groupByBlock(responses: any[]) {
  return responses.reduce((acc, r) => {
    if (!acc[r.block_id]) acc[r.block_id] = [];
    acc[r.block_id].push(r);
    return acc;
  }, {} as Record<string, any[]>);
}
