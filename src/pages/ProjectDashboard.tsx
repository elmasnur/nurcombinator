import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Project, StageChecklist, NeedsCatalog, Notification, OpenCall, Application } from '@/lib/types';
import { STAGE_LABELS } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { getMonday, timeAgo } from '@/lib/helpers';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';
import StageBadge from '@/components/StageBadge';
import { Bell, Check } from 'lucide-react';

interface ChecklistItem { title: string; done: boolean; }

export default function ProjectDashboard() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [needs, setNeeds] = useState<NeedsCatalog[]>([]);
  const [selectedNeeds, setSelectedNeeds] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [openCalls, setOpenCalls] = useState<(OpenCall & { applications: Application[] })[]>([]);
  
  // Checkin form
  const [metricName, setMetricName] = useState('');
  const [metricValue, setMetricValue] = useState('');
  const [deliverableLink, setDeliverableLink] = useState('');
  const [blocker, setBlocker] = useState('');
  const [helpRequest, setHelpRequest] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || !user) return;
    fetchAll();
  }, [slug, user]);

  const fetchAll = async () => {
    const { data: p } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle();
    if (!p) { setLoading(false); return; }
    setProject(p);

    const [clRes, needsRes, pnRes, notifRes, callsRes] = await Promise.all([
      supabase.from('stage_checklists').select('*').eq('stage_key', p.current_stage).maybeSingle(),
      supabase.from('needs_catalog').select('*').or(`stage_key.eq.${p.current_stage},stage_key.is.null`).eq('is_active', true),
      supabase.from('project_needs').select('need_id').eq('project_id', p.id),
      supabase.from('notifications').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(10),
      supabase.from('open_calls').select('*, applications(*)').eq('project_id', p.id),
    ]);

    if (clRes.data?.items) {
      setChecklist(clRes.data.items as unknown as ChecklistItem[]);
    }
    setNeeds(needsRes.data ?? []);
    setSelectedNeeds(new Set((pnRes.data ?? []).map(n => n.need_id)));
    setNotifications(notifRes.data ?? []);
    setOpenCalls(callsRes.data ?? []);
    setLoading(false);
  };

  const handleCheckin = async () => {
    if (!user || !project) return;
    const weekStart = getMonday(new Date());
    const { error } = await supabase.from('checkins').upsert({
      project_id: project.id,
      user_id: user.id,
      week_start: weekStart,
      main_metric_name: metricName || null,
      main_metric_value: metricValue || null,
      deliverable_link: deliverableLink || null,
      blocker: blocker || null,
      help_request: helpRequest || null,
    }, { onConflict: 'project_id,week_start' });
    if (error) toast.error(error.message);
    else toast.success('Check-in kaydedildi');
  };

  const toggleNeed = async (needId: string) => {
    if (!project) return;
    if (selectedNeeds.has(needId)) {
      await supabase.from('project_needs').delete().eq('project_id', project.id).eq('need_id', needId);
      setSelectedNeeds(prev => { const n = new Set(prev); n.delete(needId); return n; });
    } else {
      await supabase.from('project_needs').insert({ project_id: project.id, need_id: needId });
      setSelectedNeeds(prev => new Set(prev).add(needId));
    }
  };

  const markNotifRead = async (id: string) => {
    await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
  };

  const updateAppStatus = async (appId: string, status: string) => {
    await supabase.from('applications').update({ status: status as any }).eq('id', appId);
    toast.success('Başvuru durumu güncellendi');
    fetchAll();
  };

  if (loading) return <div className="container mx-auto px-4 py-8 text-muted-foreground">Yükleniyor...</div>;
  if (!project) return <div className="container mx-auto px-4 py-8 text-muted-foreground">Proje bulunamadı.</div>;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">{project.title}</h1>
          <StageBadge stage={project.current_stage} size="md" />
        </div>
        <Button asChild variant="outline" size="sm" className="border-border">
          <Link to={`/p/${slug}/open-calls/new`}>Açık Çağrı Oluştur</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Checklist */}
        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="font-display text-base">Evre Checklist</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {checklist.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Checkbox checked={item.done} disabled className="mt-0.5" />
                  <span className={item.done ? 'line-through text-muted-foreground' : 'text-foreground'}>{item.title}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Check-in */}
        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="font-display text-base">Haftalık Check-in</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Metrik adı" value={metricName} onChange={e => setMetricName(e.target.value)} className="bg-secondary border-border text-sm" />
              <Input placeholder="Değer" value={metricValue} onChange={e => setMetricValue(e.target.value)} className="bg-secondary border-border text-sm" />
            </div>
            <Input placeholder="Çıktı linki" value={deliverableLink} onChange={e => setDeliverableLink(e.target.value)} className="bg-secondary border-border text-sm" />
            <Textarea placeholder="Engel / Blocker" value={blocker} onChange={e => setBlocker(e.target.value)} className="bg-secondary border-border text-sm" rows={2} />
            <Textarea placeholder="Yardım talebi" value={helpRequest} onChange={e => setHelpRequest(e.target.value)} className="bg-secondary border-border text-sm" rows={2} />
            <Button onClick={handleCheckin} size="sm" className="bg-primary text-primary-foreground">Kaydet</Button>
          </CardContent>
        </Card>

        {/* Needs */}
        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="font-display text-base">İhtiyaçlar</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {needs.map(n => (
                <li key={n.id} className="flex items-start gap-2">
                  <Checkbox
                    checked={selectedNeeds.has(n.id)}
                    onCheckedChange={() => toggleNeed(n.id)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm text-foreground">{n.title}</span>
                    <span className="ml-2 text-xs text-muted-foreground">({n.category})</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="font-display text-base flex items-center gap-2"><Bell className="h-4 w-4" /> Bildirimler</CardTitle></CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">Bildirim yok.</p>
            ) : (
              <ul className="space-y-2">
                {notifications.map(n => (
                  <li key={n.id} className={`rounded p-2 text-sm ${n.read_at ? 'bg-muted/50' : 'bg-accent/30 border border-primary/20'}`}>
                    <div className="flex items-center justify-between">
                      <span>{n.type === 'new_application' ? 'Yeni başvuru geldi' : n.type}</span>
                      {!n.read_at && (
                        <button onClick={() => markNotifRead(n.id)} className="text-xs text-primary hover:underline">
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{timeAgo(n.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Applications Management */}
      {openCalls.length > 0 && (
        <Card className="mt-6 border-border bg-card">
          <CardHeader><CardTitle className="font-display text-base">Başvuru Yönetimi</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {openCalls.map(oc => (
              <div key={oc.id}>
                <h4 className="mb-2 text-sm font-semibold text-foreground">{oc.title}</h4>
                {oc.applications.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Henüz başvuru yok.</p>
                ) : (
                  <ul className="space-y-2">
                    {oc.applications.map(app => (
                      <li key={app.id} className="rounded bg-secondary p-3 text-sm">
                        <p className="text-foreground">{app.message}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{app.status}</Badge>
                          {app.status === 'submitted' && (
                            <>
                              <Button size="sm" variant="ghost" className="h-6 text-xs text-success" onClick={() => updateAppStatus(app.id, 'accepted')}>Kabul</Button>
                              <Button size="sm" variant="ghost" className="h-6 text-xs text-destructive" onClick={() => updateAppStatus(app.id, 'rejected')}>Reddet</Button>
                              <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => updateAppStatus(app.id, 'shortlisted')}>Kısa Liste</Button>
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
