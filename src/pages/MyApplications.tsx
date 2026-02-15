import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Guard from '@/components/Guard';
import EmptyState from '@/components/EmptyState';
import { Application } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/helpers';
import { getUserFriendlyError } from '@/lib/error-utils';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Gönderildi', shortlisted: 'Kısa Liste', accepted: 'Kabul Edildi', rejected: 'Reddedildi', withdrawn: 'Geri Çekildi',
};

const STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-info/20 text-info-foreground',
  shortlisted: 'bg-warning/20 text-warning-foreground',
  accepted: 'bg-success/20 text-success-foreground',
  rejected: 'bg-destructive/20 text-destructive-foreground',
  withdrawn: 'bg-muted text-muted-foreground',
};

function ApplicationsList() {
  const { user } = useAuth();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchApps = async () => {
      const { data } = await supabase.from('applications').select('*, open_calls(id, title, project_id)').eq('applicant_id', user.id).order('created_at', { ascending: false });
      const appsData = data ?? [];

      // Fetch project info
      const projectIds = [...new Set(appsData.map(a => a.open_calls?.project_id).filter(Boolean))];
      let projectMap = new Map();
      if (projectIds.length > 0) {
        const { data: projects } = await supabase.from('projects').select('id,slug,title').in('id', projectIds);
        projectMap = new Map((projects ?? []).map(p => [p.id, p]));
      }

      setApps(appsData.map(a => ({
        ...a,
        _project: a.open_calls?.project_id ? projectMap.get(a.open_calls.project_id) : null,
      })));
      setLoading(false);
    };
    fetchApps();
  }, [user]);

  const withdraw = async (id: string) => {
    const { error } = await supabase.from('applications').update({ status: 'withdrawn' as any }).eq('id', id);
    if (error) toast.error(getUserFriendlyError(error));
    else {
      toast.success('Başvuru geri çekildi');
      setApps(prev => prev.map(a => a.id === id ? { ...a, status: 'withdrawn' } : a));
    }
  };

  if (loading) return (
    <div className="container mx-auto max-w-2xl px-4 py-8 space-y-3">
      <Skeleton className="h-8 w-1/3" />
      {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
    </div>
  );

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold">Başvurularım</h1>
      {apps.length === 0 ? (
        <EmptyState message="Henüz başvurunuz yok." actionLabel="Açık Çağrıları Keşfet" actionTo="/explore" />
      ) : (
        <div className="space-y-3">
          {apps.map(a => (
            <Card key={a.id} className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Link to={`/open-calls/${a.open_call_id}`} className="text-sm font-semibold text-foreground hover:text-primary">
                      {a.open_calls?.title ?? 'Çağrı'}
                    </Link>
                    {a._project && (
                      <Link to={`/p/${a._project.slug}`} className="ml-2 text-xs text-muted-foreground hover:text-primary">
                        {a._project.title}
                      </Link>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{a.message}</p>
                    <span className="text-xs text-muted-foreground">{formatDate(a.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`rounded px-2 py-0.5 text-xs ${STATUS_COLORS[a.status] ?? 'bg-muted text-muted-foreground'}`}>
                      {STATUS_LABELS[a.status] ?? a.status}
                    </span>
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

export default function MyApplications() {
  return (
    <Guard requireAuth>
      <ApplicationsList />
    </Guard>
  );
}
