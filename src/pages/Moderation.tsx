import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Report } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/helpers';
import { toast } from 'sonner';

export default function Moderation() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('reports').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error('Yetkisiz erişim');
        setReports(data ?? []);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('reports').update({ status }).eq('id', id);
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    toast.success('Durum güncellendi');
  };

  if (loading) return <div className="container mx-auto px-4 py-8 text-muted-foreground">Yükleniyor...</div>;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold">Moderasyon Paneli</h1>
      {reports.length === 0 ? <p className="text-muted-foreground">Rapor yok.</p> : (
        <div className="space-y-3">
          {reports.map(r => (
            <Card key={r.id} className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="mb-1 text-xs">{r.target_type}</Badge>
                    <p className="text-sm text-foreground">{r.reason}</p>
                    <span className="text-xs text-muted-foreground">{formatDate(r.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant={r.status === 'open' ? 'destructive' : 'secondary'} className="text-xs">{r.status}</Badge>
                    {r.status === 'open' && (
                      <>
                        <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => updateStatus(r.id, 'reviewing')}>İncele</Button>
                        <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => updateStatus(r.id, 'resolved')}>Çöz</Button>
                        <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => updateStatus(r.id, 'rejected')}>Reddet</Button>
                      </>
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
