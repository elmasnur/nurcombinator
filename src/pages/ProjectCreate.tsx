import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Guard from '@/components/Guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PROJECT_TYPE_LABELS, STAGE_LABELS, ProjectType, StageKey, ProjectVisibility } from '@/lib/types';
import { slugify } from '@/lib/helpers';
import { getUserFriendlyError } from '@/lib/error-utils';
import { toast } from 'sonner';

function ProjectCreateForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ProjectType>('other');
  const [visibility, setVisibility] = useState<ProjectVisibility>('public');
  const [stage, setStage] = useState<StageKey>('niyet_istikamet');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const slug = slugify(title) + '-' + Date.now().toString(36);
    const tagsArr = tags.split(',').map(t => t.trim()).filter(Boolean);

    const { data, error } = await supabase.from('projects').insert({
      owner_id: user.id,
      title: title.trim(),
      slug,
      summary: summary.trim() || null,
      description: description.trim() || null,
      type,
      visibility,
      current_stage: stage,
      tags: tagsArr,
    }).select().single();

    if (error) {
      toast.error(getUserFriendlyError(error));
      setLoading(false);
      return;
    }

    // Add owner as project member
    await supabase.from('project_members').insert({
      project_id: data.id,
      user_id: user.id,
      role: 'owner' as const,
    });

    toast.success('Proje oluşturuldu!');
    navigate(`/p/${slug}/dashboard`);
    setLoading(false);
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold">Yeni Proje Oluştur</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Proje Adı *</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} required maxLength={120} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <Label>Özet</Label>
          <Textarea value={summary} onChange={e => setSummary(e.target.value)} maxLength={500} className="mt-1 bg-secondary border-border" rows={3} />
        </div>
        <div>
          <Label>Açıklama (detaylı)</Label>
          <Textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={5000} className="mt-1 bg-secondary border-border" rows={5} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Tür</Label>
            <Select value={type} onValueChange={v => setType(v as ProjectType)}>
              <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(PROJECT_TYPE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Görünürlük</Label>
            <Select value={visibility} onValueChange={v => setVisibility(v as ProjectVisibility)}>
              <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Herkese Açık</SelectItem>
                <SelectItem value="verified_only">Doğrulanmış</SelectItem>
                <SelectItem value="private">Özel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>Başlangıç Evresi</Label>
          <Select value={stage} onValueChange={v => setStage(v as StageKey)}>
            <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(STAGE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Etiketler (virgülle ayırın)</Label>
          <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="risale, gençlik, dijital" className="mt-1 bg-secondary border-border" />
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground">
          {loading ? 'Oluşturuluyor...' : 'Proje Oluştur'}
        </Button>
      </form>
    </div>
  );
}

export default function ProjectCreate() {
  return (
    <Guard requireAuth>
      <ProjectCreateForm />
    </Guard>
  );
}
