import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { LeadRow } from '@/types/database';

export async function fetchMyLeads(): Promise<LeadRow[]> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as LeadRow[];
}
