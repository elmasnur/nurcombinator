import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { OpenCall, CALL_TYPE_LABELS, LOCATION_MODE_LABELS } from '@/lib/types';
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
import { toast } from 'sonner';
import { MapPin, Clock, Users } from 'lucide-react';

export default function OpenCallDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
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
      setCall(data);
      setLoading(false);
    });
    if (user) {
      supabase.from('applications').select('id').eq('open_call_id', id).eq('applicant_id', user.id).maybeSingle().then(({ data }) => {
        if (data) setAlreadyApplied(true);
      });
    }
  }, [id, user]);

  const handleApply = async () => {
    if (!user || !id) return;
    setSubmitting(true);
    const links = [link1, link2, link3].filter(Boolean);
    const { error } = await supabase.from('applications').insert({
      open_call_id: id,
      applicant_id: user.id,
      message: message.trim(),
      links: links as any,
    });
    if (error) {
      if (error.code === '23505') toast.error('Bu çağrıya zaten başvurdunuz.');
      else toast.error('Başvuru gönderilemedi: ' + error.message);
    } else {
      toast.success('Başvurunuz gönderildi!');
      navigate('/me/applications');
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="container mx-auto max-w-2xl px-4 py-8 space-y-4">
      <Skeleton className="h-8 w-2/3" /><Skeleton className="h-4 w-1/3" /><Skeleton className="h-32 w-full" />
    </div>
  );
  if (!call) return <div className="container mx-auto px-4 py-8"><ErrorState title="Çağrı bulunamadı" /></div>;

  const isClosed = call.status === 'closed';

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 font-display text-2xl font-bold">{call.title}</h1>
      {call.projects && (
        <Link to={`/p/${call.projects.slug}`} className="text-sm text-primary hover:underline">
          {call.projects.title}
        </Link>
      )}

      <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
        <Badge variant="outline" className="border-border">{CALL_TYPE_LABELS[call.call_type]}</Badge>
        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{LOCATION_MODE_LABELS[call.location_mode]}</span>
        {call.commitment && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{call.commitment}</span>}
        {call.apply_until && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Son: {formatDate(call.apply_until)}</span>}
        {call.tags?.map(t => <span key={t} className="rounded bg-muted px-2 py-0.5 text-xs">{t}</span>)}
      </div>

      {call.description && <p className="mt-4 text-foreground whitespace-pre-line">{call.description}</p>}

      {user && <div className="mt-4"><ReportDialog targetType="open_call" targetId={call.id} /></div>}

      {/* Apply */}
      <Card className="mt-8 border-border bg-card">
        <CardContent className="p-5">
          {isClosed ? (
            <p className="text-center text-muted-foreground">Bu çağrı kapatılmıştır.</p>
          ) : !user ? (
            <div className="text-center">
              <p className="mb-3 text-muted-foreground">Başvuru yapmak için giriş yapmalısınız.</p>
              <Button asChild className="bg-primary text-primary-foreground"><Link to={`/auth?redirect=/open-calls/${id}`}>Giriş Yap</Link></Button>
            </div>
          ) : alreadyApplied ? (
            <p className="text-center text-muted-foreground">Bu çağrıya zaten başvurdunuz.</p>
          ) : (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-semibold">Başvuru Yap</h3>
              <div>
                <Label>Mesajınız *</Label>
                <Textarea value={message} onChange={e => setMessage(e.target.value)} minLength={50} maxLength={1200} placeholder="Kendinizi tanıtın ve bu role neden uygun olduğunuzu açıklayın..." className="mt-1 bg-secondary border-border" rows={5} />
                <p className="mt-1 text-xs text-muted-foreground">{message.length}/1200 karakter (min 50)</p>
              </div>
              <div className="space-y-2">
                <Label>Linkler (opsiyonel)</Label>
                <Input value={link1} onChange={e => setLink1(e.target.value)} placeholder="https://..." className="bg-secondary border-border" />
                <Input value={link2} onChange={e => setLink2(e.target.value)} placeholder="https://..." className="bg-secondary border-border" />
                <Input value={link3} onChange={e => setLink3(e.target.value)} placeholder="https://..." className="bg-secondary border-border" />
              </div>
              <Button onClick={handleApply} disabled={submitting || message.trim().length < 50} className="bg-primary text-primary-foreground">
                {submitting ? 'Gönderiliyor...' : 'Başvuru Gönder'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
