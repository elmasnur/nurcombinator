import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Guard from '@/components/Guard';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { Report } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/helpers';
import { getUserFriendlyError } from '@/lib/error-utils';
import { toast } from 'sonner';

function ModerationPanel() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Check role before attempting to fetch reports
    const checkRoleAndFetch = async () => {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      const hasAccess = (roles ?? []).some(r => r.role === 'admin' || r.role === 'moderator');
      if (!hasAccess) {
        setForbidden(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) { setForbidden(true); }
      setReports(data ?? []);
      setLoading(false);
    };
    checkRoleAndFetch();
  }, [user]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('reports').update({ status }).eq('id', id);
    if (error) toast.error(getUserFriendlyError(error));
    else {
      setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      toast.success('Durum güncellendi');
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8 text-muted-foreground">Yükleniyor...</div>;
  if (forbidden) return <div className="container mx-auto px-4 py-8"><ErrorState title="Yetkisiz Erişim" description="Bu panele erişim yetkiniz yok." /></div>;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold">Moderasyon Paneli</h1>
      {reports.length === 0 ? <EmptyState message="Rapor yok." /> : (
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

export default function Moderation() {
  return (
    <Guard requireAuth>
      <ModerationPanel />
    </Guard>
  );
}
