import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CALL_TYPE_LABELS, LOCATION_MODE_LABELS, CallType, LocationMode, ProjectVisibility } from '@/lib/types';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function OpenCallCreate() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [callType, setCallType] = useState<CallType>('volunteer');
  const [commitment, setCommitment] = useState('');
  const [locationMode, setLocationMode] = useState<LocationMode>('remote');
  const [visibility, setVisibility] = useState<ProjectVisibility>('public');
  const [description, setDescription] = useState('');
  const [applyUntil, setApplyUntil] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase.from('projects').select('id').eq('slug', slug).maybeSingle().then(({ data }) => {
      if (data) setProjectId(data.id);
    });
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !projectId) return;
    setLoading(true);
    const { error } = await supabase.from('open_calls').insert({
      project_id: projectId,
      title: title.trim(),
      call_type: callType,
      commitment: commitment || null,
      location_mode: locationMode,
      visibility,
      description: description || null,
      apply_until: applyUntil || null,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      created_by: user.id,
    });
    if (error) toast.error(error.message);
    else { toast.success('Açık çağrı oluşturuldu!'); navigate(`/p/${slug}`); }
    setLoading(false);
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold">Açık Çağrı Oluştur</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><Label>Rol / Başlık *</Label><Input value={title} onChange={e => setTitle(e.target.value)} required maxLength={120} className="mt-1 bg-secondary border-border" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Tür</Label><Select value={callType} onValueChange={v => setCallType(v as CallType)}><SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(CALL_TYPE_LABELS).map(([k,v])=><SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Konum</Label><Select value={locationMode} onValueChange={v => setLocationMode(v as LocationMode)}><SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(LOCATION_MODE_LABELS).map(([k,v])=><SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
        </div>
        <div><Label>Görünürlük</Label><Select value={visibility} onValueChange={v => setVisibility(v as ProjectVisibility)}><SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="public">Herkese Açık</SelectItem><SelectItem value="verified_only">Doğrulanmış</SelectItem></SelectContent></Select></div>
        <div><Label>Taahhüt</Label><Input value={commitment} onChange={e => setCommitment(e.target.value)} placeholder="Hafta 5 saat" className="mt-1 bg-secondary border-border" /></div>
        <div><Label>Son Başvuru</Label><Input type="date" value={applyUntil} onChange={e => setApplyUntil(e.target.value)} className="mt-1 bg-secondary border-border" /></div>
        <div><Label>Açıklama</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={2000} className="mt-1 bg-secondary border-border" rows={4} /></div>
        <div><Label>Etiketler</Label><Input value={tags} onChange={e => setTags(e.target.value)} placeholder="tasarım, yazılım" className="mt-1 bg-secondary border-border" /></div>
        <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground">{loading ? 'Oluşturuluyor...' : 'Çağrı Oluştur'}</Button>
      </form>
    </div>
  );
}
