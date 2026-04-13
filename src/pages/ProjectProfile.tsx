import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Project, OpenCall, NeedsCatalog } from '@/lib/types';
import StageBadge from '@/components/StageBadge';
import OpenCallCard from '@/components/OpenCallCard';
import ReportDialog from '@/components/ReportDialog';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

export default function ProjectProfile() {
  const { slug, lang } = useParams<{ slug: string; lang: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const prefix = `/${lang ?? 'tr'}`;
  const [project, setProject] = useState<Project | null>(null);
  const [calls, setCalls] = useState<OpenCall[]>([]);
  const [needs, setNeeds] = useState<NeedsCatalog[]>([]);
  const [isTeam, setIsTeam] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetchProject();
  }, [slug, user]);

  const fetchProject = async () => {
    setLoading(true); setError(false);
    const { data: p, error: pErr } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle();
    if (pErr || !p) { setError(!!pErr); setLoading(false); return; }
    setProject(p);
    setIsOwner(user?.id === p.owner_id);
    const [callsRes, needsRes] = await Promise.all([
      supabase.from('open_calls').select('*').eq('project_id', p.id).eq('status', 'open').order('created_at', { ascending: false }),
      supabase.from('project_needs').select('need_id').eq('project_id', p.id),
    ]);
    setCalls(callsRes.data ?? []);
    const needIds = (needsRes.data ?? []).map(n => n.need_id);
    if (needIds.length > 0) {
      const { data: nData } = await supabase.from('needs_catalog').select('*').in('id', needIds);
      setNeeds(nData ?? []);
    } else setNeeds([]);
    if (user) {
      const { data: mem } = await supabase.from('project_members').select('role').eq('project_id', p.id).eq('user_id', user.id).maybeSingle();
      setIsTeam(user.id === p.owner_id || !!mem?.role);
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-4">
      <Skeleton className="h-8 w-2/3" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-1/2" />
    </div>
  );
  if (error) return <div className="container mx-auto px-4 py-8"><ErrorState onRetry={fetchProject} /></div>;
  if (!project) return <div className="container mx-auto px-4 py-8"><EmptyState message={t('projectProfile.notFound')} /></div>;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-bold">{project.title}</h1>
          <StageBadge stage={project.current_stage} size="md" />
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span className="rounded bg-secondary px-2 py-0.5">{t(`projectTypes.${project.type}`)}</span>
          {project.tags?.map(tg => <span key={tg} className="rounded bg-muted px-2 py-0.5">{tg}</span>)}
        </div>
        {project.summary && <p className="mt-3 text-foreground">{project.summary}</p>}
        {project.description && <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {isTeam && (
          <Button asChild variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
            <Link to={`${prefix}/p/${slug}/dashboard`}>{t('projectProfile.dashboard')}</Link>
          </Button>
        )}
        {(isOwner || isTeam) && (
          <Button asChild variant="outline" className="border-border">
            <Link to={`${prefix}/p/${slug}/open-calls/new`}>{t('projectProfile.createCall')}</Link>
          </Button>
        )}
        {user && project && <ReportDialog targetType="project" targetId={project.id} />}
      </div>

      <Card className="mb-6 border-border bg-card">
        <CardHeader><CardTitle className="font-display text-lg">{t('projectProfile.openCalls')}</CardTitle></CardHeader>
        <CardContent>
          {calls.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('projectProfile.noOpenCalls')}</p>
          ) : (
            <div className="space-y-3">{calls.map(c => <OpenCallCard key={c.id} call={c} />)}</div>
          )}
        </CardContent>
      </Card>

      {needs.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="font-display text-lg">{t('projectProfile.needs')}</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {needs.map(n => (
                <span key={n.id} className="rounded-full bg-accent/30 px-3 py-1 text-xs text-accent-foreground">{n.title}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
