import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Guard from '@/components/Guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectType, StageKey, ProjectVisibility, STAGE_ORDER } from '@/lib/types';
import { slugify } from '@/lib/helpers';
import { getUserFriendlyError } from '@/lib/error-utils';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';

const PROJECT_TYPES: ProjectType[] = ['content','app','community','open_source','education','media','other'];

function ProjectCreateForm() {
  const { user } = useAuth();
  const navigate = useLocalizedNavigate();
  const { t } = useTranslation();
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
      owner_id: user.id, title: title.trim(), slug,
      summary: summary.trim() || null, description: description.trim() || null,
      type, visibility, current_stage: stage, tags: tagsArr,
    }).select().single();
    if (error) { toast.error(getUserFriendlyError(error)); setLoading(false); return; }
    await supabase.from('project_members').insert({ project_id: data.id, user_id: user.id, role: 'owner' as const });
    toast.success(t('projectCreate.success'));
    navigate(`/p/${slug}/dashboard`);
    setLoading(false);
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold">{t('projectCreate.title')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>{t('projectCreate.name')} *</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} required maxLength={120} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <Label>{t('projectCreate.summary')}</Label>
          <Textarea value={summary} onChange={e => setSummary(e.target.value)} maxLength={500} className="mt-1 bg-secondary border-border" rows={3} />
        </div>
        <div>
          <Label>{t('projectCreate.description')}</Label>
          <Textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={5000} className="mt-1 bg-secondary border-border" rows={5} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>{t('projectCreate.type')}</Label>
            <Select value={type} onValueChange={v => setType(v as ProjectType)}>
              <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PROJECT_TYPES.map(k => <SelectItem key={k} value={k}>{t(`projectTypes.${k}`)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t('projectCreate.visibility')}</Label>
            <Select value={visibility} onValueChange={v => setVisibility(v as ProjectVisibility)}>
              <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="public">{t('projectCreate.visPublic')}</SelectItem>
                <SelectItem value="verified_only">{t('projectCreate.visVerified')}</SelectItem>
                <SelectItem value="private">{t('projectCreate.visPrivate')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>{t('projectCreate.startStage')}</Label>
          <Select value={stage} onValueChange={v => setStage(v as StageKey)}>
            <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STAGE_ORDER.map(k => <SelectItem key={k} value={k}>{t(`stages.${k}`)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>{t('projectCreate.tags')}</Label>
          <Input value={tags} onChange={e => setTags(e.target.value)} placeholder={t('projectCreate.tagsPlaceholder')} className="mt-1 bg-secondary border-border" />
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground">
          {loading ? t('projectCreate.submitting') : t('projectCreate.submit')}
        </Button>
      </form>
    </div>
  );
}

export default function ProjectCreate() {
  return <Guard requireAuth><ProjectCreateForm /></Guard>;
}
