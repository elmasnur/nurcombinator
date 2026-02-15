import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { OpenCall } from '@/lib/types';
import { CALL_TYPE_LABELS, LOCATION_MODE_LABELS } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/lib/helpers';
import { toast } from 'sonner';

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
    if (error) toast.error(error.message);
    else { toast.success('Başvurunuz gönderildi!'); navigate('/me/applications'); }
    setSubmitting(false);
  };

  if (loading) return <div className="container mx-auto px-4 py-8 text-muted-foreground">Yükleniyor...</div>;
  if (!call) return <div className="container mx-auto px-4 py-8 text-muted-foreground">Çağrı bulunamadı.</div>;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 font-display text-2xl font-bold">{call.title}</h1>
      {call.projects && (
        <Link to={`/p/${call.projects.slug}`} className="text-sm text-primary hover:underline">
          {call.projects.title}
        </Link>
      )}
      <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
        <span>{CALL_TYPE_LABELS[call.call_type]}</span>
        <span>{LOCATION_MODE_LABELS[call.location_mode]}</span>
        {call.commitment && <span>Taahhüt: {call.commitment}</span>}
        {call.apply_until && <span>Son: {formatDate(call.apply_until)}</span>}
      </div>
      {call.description && <p className="mt-4 text-foreground">{call.description}</p>}

      {/* Apply */}
      <Card className="mt-8 border-border bg-card">
        <CardContent className="p-5">
          {!user ? (
            <div className="text-center">
              <p className="mb-3 text-muted-foreground">Başvuru yapmak için giriş yapmalısınız.</p>
              <Button asChild className="bg-primary text-primary-foreground"><Link to="/auth">Giriş Yap</Link></Button>
            </div>
          ) : alreadyApplied ? (
            <p className="text-center text-muted-foreground">Bu çağrıya zaten başvurdunuz.</p>
          ) : (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-semibold">Başvuru Yap</h3>
              <div><Label>Mesajınız *</Label><Textarea value={message} onChange={e => setMessage(e.target.value)} required minLength={50} maxLength={1200} placeholder="Kendinizi tanıtın ve bu role neden uygun olduğunuzu açıklayın..." className="mt-1 bg-secondary border-border" rows={5} /></div>
              <div><Label>Linkler (opsiyonel)</Label>
                <Input value={link1} onChange={e => setLink1(e.target.value)} placeholder="https://..." className="mt-1 bg-secondary border-border" />
                <Input value={link2} onChange={e => setLink2(e.target.value)} placeholder="https://..." className="mt-1 bg-secondary border-border" />
                <Input value={link3} onChange={e => setLink3(e.target.value)} placeholder="https://..." className="mt-1 bg-secondary border-border" />
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
