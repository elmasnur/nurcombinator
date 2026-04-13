import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Guard from '@/components/Guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CallType, LocationMode, ProjectVisibility } from '@/lib/types';
import { getUserFriendlyError } from '@/lib/error-utils';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';

const CALL_TYPES: CallType[] = ['core','volunteer','short_task','advisor'];
const LOCATION_MODES: LocationMode[] = ['remote','onsite','hybrid'];

function OpenCallForm() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useLocalizedNavigate();
  const { t } = useTranslation();
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
    const { data, error } = await supabase.from('open_calls').insert({
      project_id: projectId, title: title.trim(), call_type: callType,
      commitment: commitment || null, location_mode: locationMode, visibility,
      description: description || null, apply_until: applyUntil || null,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean), created_by: user.id,
    }).select('id').single();
    if (error) toast.error(getUserFriendlyError(error));
    else { toast.success(t('openCallCreate.success')); navigate(`/open-calls/${data.id}`); }
    setLoading(false);
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold">{t('openCallCreate.title')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>{t('openCallCreate.roleTitle')} *</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} required maxLength={120} className="mt-1 bg-secondary border-border" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>{t('openCallCreate.type')}</Label>
            <Select value={callType} onValueChange={v => setCallType(v as CallType)}>
              <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
              <SelectContent>{CALL_TYPES.map(k => <SelectItem key={k} value={k}>{t(`callTypes.${k}`)}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t('openCallCreate.location')}</Label>
            <Select value={locationMode} onValueChange={v => setLocationMode(v as LocationMode)}>
              <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
              <SelectContent>{LOCATION_MODES.map(k => <SelectItem key={k} value={k}>{t(`locationModes.${k}`)}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>{t('openCallCreate.visibility')}</Label>
          <Select value={visibility} onValueChange={v => setVisibility(v as ProjectVisibility)}>
            <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="public">{t('openCallCreate.visPublic')}</SelectItem>
              <SelectItem value="verified_only">{t('openCallCreate.visVerified')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>{t('openCallCreate.commitment')}</Label>
          <Input value={commitment} onChange={e => setCommitment(e.target.value)} placeholder={t('openCallCreate.commitmentPlaceholder')} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <Label>{t('openCallCreate.deadline')}</Label>
          <Input type="date" value={applyUntil} onChange={e => setApplyUntil(e.target.value)} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <Label>{t('openCallCreate.description')}</Label>
          <Textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={2000} className="mt-1 bg-secondary border-border" rows={4} placeholder={t('openCallCreate.descPlaceholder')} />
        </div>
        <div>
          <Label>{t('openCallCreate.tags')}</Label>
          <Input value={tags} onChange={e => setTags(e.target.value)} placeholder={t('openCallCreate.tagsPlaceholder')} className="mt-1 bg-secondary border-border" />
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground">{loading ? t('openCallCreate.submitting') : t('openCallCreate.submit')}</Button>
      </form>
    </div>
  );
}

export default function OpenCallCreate() {
  return <Guard requireAuth><OpenCallForm /></Guard>;
}
