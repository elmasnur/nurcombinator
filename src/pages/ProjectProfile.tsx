import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Project, OpenCall, NeedsCatalog } from '@/lib/types';
import { PROJECT_TYPE_LABELS } from '@/lib/types';
import StageBadge from '@/components/StageBadge';
import OpenCallCard from '@/components/OpenCallCard';
import ReportDialog from '@/components/ReportDialog';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
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
    setLoading(true);
    setError(false);
    const { data: p, error: pErr } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle();
    if (pErr || !p) {
      setError(!!pErr);
      setLoading(false);
      return;
    }
    setProject(p);
    setIsOwner(user?.id === p.owner_id);

    const [callsRes, needsRes] = await Promise.all([
      supabase.from('open_calls').select('*').eq('project_id', p.id).eq('status', 'open').order('created_at', { ascending: false }),
      supabase.from('project_needs').select('need_id').eq('project_id', p.id),
    ]);
    setCalls(callsRes.data ?? []);

    // Fetch need details
    const needIds = (needsRes.data ?? []).map(n => n.need_id);
    if (needIds.length > 0) {
      const { data: nData } = await supabase.from('needs_catalog').select('*').in('id', needIds);
      setNeeds(nData ?? []);
    } else {
      setNeeds([]);
    }

    if (user) {
      const { data: mem } = await supabase.from('project_members').select('role').eq('project_id', p.id).eq('user_id', user.id).maybeSingle();
      const memberRole = mem?.role;
      setIsTeam(user.id === p.owner_id || !!memberRole);
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-4">
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );

  if (error) return <div className="container mx-auto px-4 py-8"><ErrorState onRetry={fetchProject} /></div>;
  if (!project) return <div className="container mx-auto px-4 py-8"><EmptyState message="Proje bulunamadı." /></div>;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-bold">{project.title}</h1>
          <StageBadge stage={project.current_stage} size="md" />
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span className="rounded bg-secondary px-2 py-0.5">{PROJECT_TYPE_LABELS[project.type]}</span>
          {project.tags?.map(t => <span key={t} className="rounded bg-muted px-2 py-0.5">{t}</span>)}
        </div>
        {project.summary && <p className="mt-3 text-foreground">{project.summary}</p>}
        {project.description && <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>}
      </div>

      {/* Actions */}
      <div className="mb-6 flex flex-wrap gap-2">
        {isTeam && (
          <Button asChild variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
            <Link to={`/p/${slug}/dashboard`}>Dashboard</Link>
          </Button>
        )}
        {(isOwner || isTeam) && (
          <Button asChild variant="outline" className="border-border">
            <Link to={`/p/${slug}/open-calls/new`}>Açık Çağrı Oluştur</Link>
          </Button>
        )}
        {user && project && <ReportDialog targetType="project" targetId={project.id} />}
      </div>

      {/* Open Calls */}
      <Card className="mb-6 border-border bg-card">
        <CardHeader><CardTitle className="font-display text-lg">Açık Çağrılar</CardTitle></CardHeader>
        <CardContent>
          {calls.length === 0 ? (
            <p className="text-sm text-muted-foreground">Şu an açık çağrı yok.</p>
          ) : (
            <div className="space-y-3">
              {calls.map(c => <OpenCallCard key={c.id} call={c} />)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Needs */}
      {needs.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="font-display text-lg">İhtiyaçlar</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {needs.map(n => (
                <span key={n.id} className="rounded-full bg-accent/30 px-3 py-1 text-xs text-accent-foreground">
                  {n.title}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
