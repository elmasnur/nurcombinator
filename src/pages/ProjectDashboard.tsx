import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Project, NeedsCatalog, Notification, OpenCall, Application, StageKey, STAGE_LABELS, STAGE_ORDER } from '@/lib/types';
import { qProfilesPublicByIds } from '@/lib/queries';
import Guard from '@/components/Guard';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import StageBadge from '@/components/StageBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { getMonday, timeAgo } from '@/lib/helpers';
import { toast } from 'sonner';
import { getUserFriendlyError } from '@/lib/error-utils';
import { Bell, Check } from 'lucide-react';

interface ChecklistItem { title: string; done: boolean; }

const APP_STATUS_LABELS: Record<string, string> = {
  submitted: 'Gönderildi', shortlisted: 'Kısa Liste', accepted: 'Kabul', rejected: 'Reddedildi', withdrawn: 'Geri Çekildi',
};

function DashboardContent() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [memberRole, setMemberRole] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [needs, setNeeds] = useState<NeedsCatalog[]>([]);
  const [selectedNeeds, setSelectedNeeds] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [openCalls, setOpenCalls] = useState<OpenCall[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicantMap, setApplicantMap] = useState<Map<string, any>>(new Map());
  
  // Checkin form
  const [metricName, setMetricName] = useState('');
  const [metricValue, setMetricValue] = useState('');
  const [deliverableLink, setDeliverableLink] = useState('');
  const [blocker, setBlocker] = useState('');
  const [helpRequest, setHelpRequest] = useState('');
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  const isOwnerOrCore = project?.owner_id === user?.id || memberRole === 'owner' || memberRole === 'core';

  const fetchAll = useCallback(async () => {
    if (!slug || !user) return;
    setLoading(true);
    const { data: p } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle();
    if (!p) { setLoading(false); return; }
    setProject(p);

    // Check membership
    const { data: mem, error: memErr } = await supabase.from('project_members').select('role').eq('project_id', p.id).eq('user_id', user.id).maybeSingle();
    if (!mem && p.owner_id !== user.id) { setForbidden(true); setLoading(false); return; }
    setMemberRole(mem?.role ?? null);

    const [clRes, needsRes, pnRes, notifRes, callsRes] = await Promise.all([
      supabase.from('stage_checklists').select('items').eq('stage_key', p.current_stage).maybeSingle(),
      supabase.from('needs_catalog').select('*').or(`stage_key.eq.${p.current_stage},stage_key.is.null`).eq('is_active', true),
      supabase.from('project_needs').select('need_id').eq('project_id', p.id),
      supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
      supabase.from('open_calls').select('*').eq('project_id', p.id).order('created_at', { ascending: false }),
    ]);

    if (clRes.data?.items) setChecklist(clRes.data.items as unknown as ChecklistItem[]);
    setNeeds(needsRes.data ?? []);
    setSelectedNeeds(new Set((pnRes.data ?? []).map(n => n.need_id)));
    setNotifications(notifRes.data ?? []);
    setOpenCalls(callsRes.data ?? []);

    // Fetch applications for project calls
    const callIds = (callsRes.data ?? []).map(c => c.id);
    if (callIds.length > 0) {
      const { data: appsData } = await supabase.from('applications').select('*').in('open_call_id', callIds).order('created_at', { ascending: false });
      setApplications(appsData ?? []);

      // Fetch applicant profiles
      const applicantIds = [...new Set((appsData ?? []).map(a => a.applicant_id))];
      if (applicantIds.length > 0) {
        const { data: profiles } = await qProfilesPublicByIds(applicantIds);
        setApplicantMap(new Map((profiles ?? []).map(p => [p.id!, p])));
      }
    }

    // Load existing checkin
    const weekStart = getMonday(new Date());
    const { data: existingCheckin } = await supabase.from('checkins').select('*').eq('project_id', p.id).eq('week_start', weekStart).maybeSingle();
    if (existingCheckin) {
      setMetricName(existingCheckin.main_metric_name || '');
      setMetricValue(existingCheckin.main_metric_value || '');
      setDeliverableLink(existingCheckin.deliverable_link || '');
      setBlocker(existingCheckin.blocker || '');
      setHelpRequest(existingCheckin.help_request || '');
    }

    setLoading(false);
  }, [slug, user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

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
    if (error) toast.error(getUserFriendlyError(error));
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
    const { error } = await supabase.from('applications').update({ status: status as any }).eq('id', appId);
    if (error) toast.error(getUserFriendlyError(error));
    else { toast.success('Başvuru durumu güncellendi'); fetchAll(); }
  };

  const handleStageChange = async (newStage: string) => {
    if (!project) return;
    const { error } = await supabase.from('projects').update({
      current_stage: newStage as StageKey,
      stage_updated_at: new Date().toISOString(),
    }).eq('id', project.id);
    if (error) toast.error(getUserFriendlyError(error));
    else { toast.success('Evre güncellendi'); fetchAll(); }
  };

  const handleCallStatus = async (callId: string, status: string) => {
    const { error } = await supabase.from('open_calls').update({ status: status as any }).eq('id', callId);
    if (error) toast.error(getUserFriendlyError(error));
    else { toast.success('Çağrı durumu güncellendi'); fetchAll(); }
  };

  if (loading) return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-48" /><Skeleton className="h-48" />
      </div>
    </div>
  );

  if (forbidden) return (
    <div className="container mx-auto px-4 py-8">
      <ErrorState title="Yetkisiz Erişim" description="Bu projenin dashboard'una erişim yetkiniz yok." />
    </div>
  );

  if (!project) return <div className="container mx-auto px-4 py-8"><EmptyState message="Proje bulunamadı." /></div>;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Top Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to={`/p/${slug}`} className="font-display text-2xl font-bold hover:text-primary transition">{project.title}</Link>
          <StageBadge stage={project.current_stage} size="md" />
        </div>
        <div className="flex items-center gap-2">
          {isOwnerOrCore && (
            <Select value={project.current_stage} onValueChange={handleStageChange}>
              <SelectTrigger className="w-52 bg-secondary border-border text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(STAGE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          <Button asChild variant="outline" size="sm" className="border-border">
            <Link to={`/p/${slug}/open-calls/new`}>Açık Çağrı Oluştur</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Checklist */}
        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="font-display text-base">Evre Checklist</CardTitle></CardHeader>
          <CardContent>
            {checklist.length === 0 ? <p className="text-sm text-muted-foreground">Bu evre için checklist yok.</p> : (
              <ul className="space-y-2">
                {checklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Checkbox checked={item.done} disabled className="mt-0.5" />
                    <span className={item.done ? 'line-through text-muted-foreground' : 'text-foreground'}>{item.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Check-in */}
        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="font-display text-base">Haftalık Check-in</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {!isOwnerOrCore ? (
              <p className="text-sm text-muted-foreground">Bu raporu ekip sorumlusu girer.</p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Metrik adı" value={metricName} onChange={e => setMetricName(e.target.value)} className="bg-secondary border-border text-sm" />
                  <Input placeholder="Değer" value={metricValue} onChange={e => setMetricValue(e.target.value)} className="bg-secondary border-border text-sm" />
                </div>
                <Input placeholder="Çıktı linki" value={deliverableLink} onChange={e => setDeliverableLink(e.target.value)} className="bg-secondary border-border text-sm" />
                <Textarea placeholder="Engel / Blocker" value={blocker} onChange={e => setBlocker(e.target.value)} className="bg-secondary border-border text-sm" rows={2} />
                <Textarea placeholder="Yardım talebi" value={helpRequest} onChange={e => setHelpRequest(e.target.value)} className="bg-secondary border-border text-sm" rows={2} />
                <Button onClick={handleCheckin} size="sm" className="bg-primary text-primary-foreground">Kaydet</Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Needs */}
        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="font-display text-base">İhtiyaçlar</CardTitle></CardHeader>
          <CardContent>
            {needs.length === 0 ? <p className="text-sm text-muted-foreground">Bu evre için ihtiyaç önerisi yok.</p> : (
              <ul className="space-y-2">
                {needs.map(n => (
                  <li key={n.id} className="flex items-start gap-2">
                    <Checkbox checked={selectedNeeds.has(n.id)} onCheckedChange={() => toggleNeed(n.id)} className="mt-0.5" />
                    <div>
                      <span className="text-sm text-foreground">{n.title}</span>
                      <span className="ml-2 text-xs text-muted-foreground">({n.category})</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
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

      {/* Open Calls Manager */}
      {openCalls.length > 0 && (
        <Card className="mt-6 border-border bg-card">
          <CardHeader><CardTitle className="font-display text-base">Açık Çağrılar Yönetimi</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {openCalls.map(oc => (
              <div key={oc.id} className="flex items-center justify-between rounded bg-secondary p-3">
                <div>
                  <span className="text-sm font-medium text-foreground">{oc.title}</span>
                  <Badge variant="outline" className="ml-2 text-xs">{oc.status === 'open' ? 'Açık' : oc.status === 'paused' ? 'Duraklat.' : 'Kapalı'}</Badge>
                </div>
                {isOwnerOrCore && (
                  <div className="flex gap-1">
                    {oc.status === 'open' && <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => handleCallStatus(oc.id, 'paused')}>Duraklat</Button>}
                    {oc.status === 'paused' && <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => handleCallStatus(oc.id, 'open')}>Aç</Button>}
                    {oc.status !== 'closed' && <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => handleCallStatus(oc.id, 'closed')}>Kapat</Button>}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Applications Inbox */}
      {applications.length > 0 && (
        <Card className="mt-6 border-border bg-card">
          <CardHeader><CardTitle className="font-display text-base">Başvuru Yönetimi</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {applications.map(app => {
                const applicant = applicantMap.get(app.applicant_id);
                const callTitle = openCalls.find(c => c.id === app.open_call_id)?.title;
                return (
                  <div key={app.id} className="rounded bg-secondary p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-sm font-medium text-foreground">{applicant?.display_name || 'Bilinmiyor'}</span>
                        {callTitle && <span className="ml-2 text-xs text-muted-foreground">→ {callTitle}</span>}
                      </div>
                      <Badge variant="outline" className="text-xs">{APP_STATUS_LABELS[app.status] ?? app.status}</Badge>
                    </div>
                    <p className="text-sm text-foreground line-clamp-3">{app.message}</p>
                    {applicant?.skills_tags?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {applicant.skills_tags.map((s: string) => <span key={s} className="rounded-full bg-accent/30 px-2 py-0.5 text-xs text-accent-foreground">{s}</span>)}
                      </div>
                    )}
                    {app.status === 'submitted' && isOwnerOrCore && (
                      <div className="mt-2 flex gap-1">
                        <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => updateAppStatus(app.id, 'shortlisted')}>Kısa Liste</Button>
                        <Button size="sm" variant="ghost" className="h-6 text-xs text-green-500" onClick={() => updateAppStatus(app.id, 'accepted')}>Kabul</Button>
                        <Button size="sm" variant="ghost" className="h-6 text-xs text-destructive" onClick={() => updateAppStatus(app.id, 'rejected')}>Reddet</Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function ProjectDashboard() {
  return (
    <Guard requireAuth>
      <DashboardContent />
    </Guard>
  );
}
