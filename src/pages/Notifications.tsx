import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Guard from '@/components/Guard';
import EmptyState from '@/components/EmptyState';
import { Notification } from '@/lib/types';
import { timeAgo } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

function NotificationsList() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50)
      .then(({ data }) => { setNotifs(data ?? []); setLoading(false); });
  }, [user]);

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id);
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
  };

  const markAllRead = async () => {
    const unreadIds = notifs.filter(n => !n.read_at).map(n => n.id);
    if (unreadIds.length === 0) return;
    await supabase.from('notifications').update({ read_at: new Date().toISOString() }).in('id', unreadIds);
    setNotifs(prev => prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
  };

  if (loading) return <div className="container mx-auto max-w-2xl px-4 py-8 text-muted-foreground">Yükleniyor...</div>;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Bildirimler</h1>
        {notifs.some(n => !n.read_at) && (
          <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={markAllRead}>Tümünü okundu işaretle</Button>
        )}
      </div>
      {notifs.length === 0 ? <EmptyState message="Bildirim yok." /> : (
        <ul className="space-y-2">
          {notifs.map(n => (
            <li key={n.id} className={`rounded p-3 text-sm ${n.read_at ? 'bg-muted/50' : 'bg-accent/30 border border-primary/20'}`}>
              <div className="flex justify-between">
                <span>{n.type === 'new_application' ? 'Yeni başvuru geldi' : n.type}</span>
                {!n.read_at && <button onClick={() => markRead(n.id)} className="text-primary"><Check className="h-4 w-4" /></button>}
              </div>
              <span className="text-xs text-muted-foreground">{timeAgo(n.created_at)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Notifications() {
  return (
    <Guard requireAuth>
      <NotificationsList />
    </Guard>
  );
}
