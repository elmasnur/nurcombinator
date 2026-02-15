import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Notification } from '@/lib/types';
import { timeAgo } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function Notifications() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50)
      .then(({ data }) => setNotifs(data ?? []));
  }, [user]);

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id);
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold">Bildirimler</h1>
      {notifs.length === 0 ? <p className="text-muted-foreground">Bildirim yok.</p> : (
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
