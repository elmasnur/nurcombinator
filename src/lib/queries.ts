import { supabase } from '@/integrations/supabase/client';
import type { StageKey, ProjectType, CallType, LocationMode } from '@/lib/types';

const PAGE_SIZE = 12;

export async function qProjectsExplore({
  search, stage, type, tag, page = 1, pageSize = PAGE_SIZE
}: {
  search?: string; stage?: string; type?: string; tag?: string; page?: number; pageSize?: number;
}) {
  let qb = supabase
    .from('projects')
    .select('id,slug,title,summary,type,current_stage,tags,cover_image_url,created_at', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (search) qb = qb.ilike('title', `%${search}%`);
  if (stage && stage !== 'all') qb = qb.eq('current_stage', stage as StageKey);
  if (type && type !== 'all') qb = qb.eq('type', type as ProjectType);
  if (tag) qb = qb.contains('tags', [tag]);
  qb = qb.range((page - 1) * pageSize, page * pageSize - 1);

  return qb;
}

export async function qOpenCallsExplore({
  search, callType, locationMode, tag, page = 1, pageSize = PAGE_SIZE
}: {
  search?: string; callType?: string; locationMode?: string; tag?: string; page?: number; pageSize?: number;
}) {
  let qb = supabase
    .from('open_calls')
    .select('id,title,call_type,commitment,location_mode,visibility,tags,status,apply_until,project_id,created_at', { count: 'exact' })
    .in('status', ['open'])
    .order('created_at', { ascending: false });

  if (search) qb = qb.ilike('title', `%${search}%`);
  if (callType && callType !== 'all') qb = qb.eq('call_type', callType as CallType);
  if (locationMode && locationMode !== 'all') qb = qb.eq('location_mode', locationMode as LocationMode);
  if (tag) qb = qb.contains('tags', [tag]);
  qb = qb.range((page - 1) * pageSize, page * pageSize - 1);

  return qb;
}

export async function qProjectsByIds(ids: string[]) {
  if (ids.length === 0) return { data: [] };
  return supabase.from('projects').select('id,slug,title').in('id', ids);
}

export async function qProfilesPublicByIds(ids: string[]) {
  if (ids.length === 0) return { data: [] };
  return supabase.from('profiles_public').select('id,display_name,bio,skills_tags,availability_hours,trust_level').in('id', ids);
}
