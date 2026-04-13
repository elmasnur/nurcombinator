import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { OpenCall } from '@/lib/types';
import ReportDialog from '@/components/ReportDialog';
import ErrorState from '@/components/ErrorState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/helpers';
import { getUserFriendlyError } from '@/lib/error-utils';
import { toast } from 'sonner';
import { MapPin, Clock, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate, useLocalizedPath } from '@/hooks/useLocalizedNavigate';

export default function OpenCallDetail() {
  const { id, lang } = useParams<{ id: string; lang: string }>();
  const { user } = useAuth();
  const navigate = useLocalizedNavigate();
  const lp = useLocalizedPath();
  const { t } = useTranslation();
  const [call, setCall] = useState<(OpenCall & { projects: { title: string; slug: string | null } | null }) | null>(null);
  const [message, setMessage] = useState('');
  const [link1, setLink1] = useState('');
  const [link2, setLink2] = useState('');
  const [link3, setLink3] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from('open_calls').select('*, projects(title, slug)').eq('id', id).maybeSingle().then(({ data }) => {
      setCall(data); setLoading(false);
    });
    if (user) {
      supabase.from('applications').select('id').eq('open_call_id', id).eq('applicant_id', user.id).maybeSingle().then(({ data }) => {
        if (data) setAlreadyApplied(true);
      });
    }
  }, [id, user]);

  const isValidUrl = (url: string): boolean => {
    try { const parsed = new URL(url); return ['http:', 'https:'].includes(parsed.protocol); }
    catch { return false; }
  };

  const handleApply = async () => {
    if (!user || !id) return;
    setSubmitting(true);
    const rawLinks = [link1, link2, link3].filter(Boolean);
    if (rawLinks.length > 0 && !rawLinks.every(isValidUrl)) {
      toast.error(t('openCallDetail.invalidUrl')); setSubmitting(false); return;
    }
    const { error } = await supabase.from('applications').insert({
      open_call_id: id, applicant_id: user.id, message: message.trim(), links: rawLinks as any,
    });
    if (error) {
      if (error.code === '23505') toast.error(t('openCallDetail.duplicateError'));
      else toast.error(getUserFriendlyError(error));
    } else { toast.success(t('openCallDetail.success')); navigate('/me/applications'); }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="container mx-auto max-w-2xl px-4 py-8 space-y-4">
      <Skeleton className="h-8 w-2/3" /><Skeleton className="h-4 w-1/3" /><Skeleton className="h-32 w-full" />
    </div>
  );
  if (!call) return <div className="container mx-auto px-4 py-8"><ErrorState title={t('openCallDetail.notFound')} /></div>;
  const isClosed = call.status === 'closed';

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 font-display text-2xl font-bold">{call.title}</h1>
      {call.projects && (
        <Link to={lp(`/p/${call.projects.slug}`)} className="text-sm text-primary hover:underline">{call.projects.title}</Link>
      )}
      <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
        <Badge variant="outline" className="border-border">{t(`callTypes.${call.call_type}`)}</Badge>
        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{t(`locationModes.${call.location_mode}`)}</span>
        {call.commitment && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{call.commitment}</span>}
        {call.apply_until && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t('openCallDetail.deadline')}: {formatDate(call.apply_until)}</span>}
        {call.tags?.map(tg => <span key={tg} className="rounded bg-muted px-2 py-0.5 text-xs">{tg}</span>)}
      </div>
      {call.description && <p className="mt-4 text-foreground whitespace-pre-line">{call.description}</p>}
      {user && <div className="mt-4"><ReportDialog targetType="open_call" targetId={call.id} /></div>}

      <Card className="mt-8 border-border bg-card">
        <CardContent className="p-5">
          {isClosed ? (
            <p className="text-center text-muted-foreground">{t('openCallDetail.closed')}</p>
          ) : !user ? (
            <div className="text-center">
              <p className="mb-3 text-muted-foreground">{t('openCallDetail.loginRequired')}</p>
              <Button asChild className="bg-primary text-primary-foreground"><Link to={lp(`/auth?redirect=/open-calls/${id}`)}>{t('nav.login')}</Link></Button>
            </div>
          ) : alreadyApplied ? (
            <p className="text-center text-muted-foreground">{t('openCallDetail.alreadyApplied')}</p>
          ) : (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-semibold">{t('openCallDetail.applyTitle')}</h3>
              <div>
                <Label>{t('openCallDetail.message')} *</Label>
                <Textarea value={message} onChange={e => setMessage(e.target.value)} minLength={50} maxLength={1200} placeholder={t('openCallDetail.messagePlaceholder')} className="mt-1 bg-secondary border-border" rows={5} />
                <p className="mt-1 text-xs text-muted-foreground">{t('openCallDetail.charCount', { count: message.length })}</p>
              </div>
              <div className="space-y-2">
                <Label>{t('openCallDetail.links')}</Label>
                <Input value={link1} onChange={e => setLink1(e.target.value)} placeholder="https://..." className="bg-secondary border-border" />
                <Input value={link2} onChange={e => setLink2(e.target.value)} placeholder="https://..." className="bg-secondary border-border" />
                <Input value={link3} onChange={e => setLink3(e.target.value)} placeholder="https://..." className="bg-secondary border-border" />
              </div>
              <Button onClick={handleApply} disabled={submitting || message.trim().length < 50} className="bg-primary text-primary-foreground">
                {submitting ? t('openCallDetail.submitting') : t('openCallDetail.submit')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
