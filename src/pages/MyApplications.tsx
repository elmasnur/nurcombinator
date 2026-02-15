import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Application } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/helpers';
import { toast } from 'sonner';

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Gönderildi', shortlisted: 'Kısa Liste', accepted: 'Kabul Edildi', rejected: 'Reddedildi', withdrawn: 'Geri Çekildi',
};

export default function MyApplications() {
  const { user } = useAuth();
  const [apps, setApps] = useState<(Application & { open_calls: { title: string } | null })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from('applications').select('*, open_calls(title)').eq('applicant_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { setApps(data ?? []); setLoading(false); });
  }, [user]);

  const withdraw = async (id: string) => {
    await supabase.from('applications').update({ status: 'withdrawn' as any }).eq('id', id);
    toast.success('Başvuru geri çekildi');
    setApps(prev => prev.map(a => a.id === id ? { ...a, status: 'withdrawn' } : a));
  };

  if (loading) return <div className="container mx-auto px-4 py-8 text-muted-foreground">Yükleniyor...</div>;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold">Başvurularım</h1>
      {apps.length === 0 ? (
        <p className="text-muted-foreground">Henüz başvurunuz yok.</p>
      ) : (
        <div className="space-y-3">
          {apps.map(a => (
            <Card key={a.id} className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{a.open_calls?.title ?? 'Çağrı'}</h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{a.message}</p>
                    <span className="text-xs text-muted-foreground">{formatDate(a.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{STATUS_LABELS[a.status] ?? a.status}</Badge>
                    {a.status === 'submitted' && (
                      <Button size="sm" variant="ghost" className="h-6 text-xs text-destructive" onClick={() => withdraw(a.id)}>Geri Çek</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
