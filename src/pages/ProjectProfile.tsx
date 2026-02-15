import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Project, OpenCall, NeedsCatalog, ProjectNeed } from '@/lib/types';
import StageBadge from '@/components/StageBadge';
import OpenCallCard from '@/components/OpenCallCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PROJECT_TYPE_LABELS } from '@/lib/types';
import { Flag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function ProjectProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [calls, setCalls] = useState<OpenCall[]>([]);
  const [needs, setNeeds] = useState<(ProjectNeed & { needs_catalog: NeedsCatalog | null })[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reportReason, setReportReason] = useState('');
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetchProject();
  }, [slug, user]);

  const fetchProject = async () => {
    const { data: p } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle();
    if (!p) { setLoading(false); return; }
    setProject(p);
    setIsOwner(user?.id === p.owner_id);

    const [callsRes, needsRes] = await Promise.all([
      supabase.from('open_calls').select('*').eq('project_id', p.id).eq('status', 'open'),
      supabase.from('project_needs').select('*, needs_catalog(*)').eq('project_id', p.id),
    ]);
    setCalls(callsRes.data ?? []);
    setNeeds(needsRes.data ?? []);

    if (user) {
      const { data: mem } = await supabase.from('project_members').select('user_id').eq('project_id', p.id).eq('user_id', user.id).maybeSingle();
      setIsMember(!!mem);
    }
    setLoading(false);
  };

  const handleReport = async () => {
    if (!user || !project || !reportReason.trim()) return;
    await supabase.from('reports').insert({
      reporter_id: user.id,
      target_type: 'project' as const,
      target_id: project.id,
      reason: reportReason.trim(),
    });
    toast.success('Rapor gönderildi');
    setReportOpen(false);
    setReportReason('');
  };

  if (loading) return <div className="container mx-auto px-4 py-8 text-muted-foreground">Yükleniyor...</div>;
  if (!project) return <div className="container mx-auto px-4 py-8 text-muted-foreground">Proje bulunamadı.</div>;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
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
        {(isOwner || isMember) && (
          <Button asChild variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
            <Link to={`/p/${slug}/dashboard`}>Dashboard</Link>
          </Button>
        )}
        {isOwner && (
          <Button asChild variant="outline" className="border-border">
            <Link to={`/p/${slug}/open-calls/new`}>Açık Çağrı Oluştur</Link>
          </Button>
        )}
        {user && (
          <Dialog open={reportOpen} onOpenChange={setReportOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Flag className="mr-1 h-3 w-3" /> Raporla
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader><DialogTitle>Proje Raporla</DialogTitle></DialogHeader>
              <Textarea value={reportReason} onChange={e => setReportReason(e.target.value)} placeholder="Raporlama nedeniniz..." maxLength={500} className="bg-secondary border-border" />
              <Button onClick={handleReport} disabled={!reportReason.trim()} className="bg-primary text-primary-foreground">Gönder</Button>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Open Calls */}
      {calls.length > 0 && (
        <Card className="mb-6 border-border bg-card">
          <CardHeader><CardTitle className="font-display text-lg">Açık Çağrılar</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {calls.map(c => <OpenCallCard key={c.id} call={c} />)}
          </CardContent>
        </Card>
      )}

      {/* Needs */}
      {needs.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="font-display text-lg">İhtiyaçlar</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {needs.map(n => (
                <li key={n.need_id} className="rounded bg-secondary p-3 text-sm">
                  <span className="font-medium text-foreground">{n.needs_catalog?.title}</span>
                  {n.needs_catalog?.description && (
                    <p className="mt-1 text-xs text-muted-foreground">{n.needs_catalog.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
