import { supabase } from './supabase';

export interface Response {
  id: string;
  email_id: string;
  block_id: string;
  recipient_token: string;
  response_type: 'nps' | 'poll' | 'rsvp' | 'rating' | 'feedback';
  value: string;
  created_at: string;
}

export async function getResponses(emailId: string): Promise<Response[]> {
  const { data, error } = await supabase.from('responses')
    .select('*').eq('email_id', emailId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Response[];
}

export function groupByBlock(responses: Response[]): Record<string, Response[]> {
  return responses.reduce((acc, r) => {
    if (!acc[r.block_id]) acc[r.block_id] = [];
    acc[r.block_id].push(r);
    return acc;
  }, {} as Record<string, Response[]>);
}
