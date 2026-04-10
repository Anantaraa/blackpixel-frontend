import { supabase } from './supabase';

export async function getTeamMemberBySlug(slug: string) {
  const { data, error } = await supabase
    .from('team')
    .select('*')
    .eq('slug', slug)
    .eq('profile_published', true)
    .single();

  if (error) {
    console.error(`[getTeamMemberBySlug] Supabase error for slug "${slug}":`, error.message);
    return null;
  }

  return data ?? null;
}