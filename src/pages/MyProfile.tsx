import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Guard from '@/components/Guard';
import EmptyState from '@/components/EmptyState';
import { Profile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserFriendlyError } from '@/lib/error-utils';
import { toast } from 'sonner';

function ProfileForm() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [hours, setHours] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle().then(({ data }) => {
      if (data) {
        setProfile(data);
        setDisplayName(data.display_name);
        setBio(data.bio || '');
        setSkills((data.skills_tags || []).join(', '));
        setHours(data.availability_hours || 0);
      }
      setLoading(false);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      display_name: displayName.trim(),
      bio: bio.trim() || null,
      skills_tags: skills.split(',').map(s => s.trim()).filter(Boolean),
      availability_hours: hours,
    }).eq('id', user.id);
    if (error) toast.error(getUserFriendlyError(error));
    else toast.success('Profil güncellendi');
    setSaving(false);
  };

  if (loading) return (
    <div className="container mx-auto max-w-lg px-4 py-8 space-y-4">
      <Skeleton className="h-8 w-1/3" /><Skeleton className="h-10 w-full" /><Skeleton className="h-20 w-full" />
    </div>
  );

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold">Profilim</h1>
      <div className="space-y-4">
        <div>
          <Label>Görünen Ad</Label>
          <Input value={displayName} onChange={e => setDisplayName(e.target.value)} maxLength={100} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <Label>Hakkımda</Label>
          <Textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={500} className="mt-1 bg-secondary border-border" rows={3} />
        </div>
        <div>
          <Label>Yetenekler (virgülle)</Label>
          <Input value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, tasarım, yazı" className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <Label>Haftalık Müsaitlik (saat)</Label>
          <Input type="number" value={hours} onChange={e => setHours(Number(e.target.value))} min={0} max={168} className="mt-1 bg-secondary border-border" />
        </div>
        <div className="rounded bg-muted p-3 text-sm text-muted-foreground">
          Güven Seviyesi: <span className="text-foreground font-medium">{profile?.trust_level ?? 0}</span> <span className="text-xs">(sadece yönetici değiştirebilir)</span>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground">
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </div>
    </div>
  );
}

export default function MyProfile() {
  return (
    <Guard requireAuth>
      <ProfileForm />
    </Guard>
  );
}
