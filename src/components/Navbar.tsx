import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Bell, LogOut, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('read_at', null)
      .then(({ count }) => setUnreadCount(count ?? 0));
  }, [user]);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="font-display text-xl font-bold text-gradient-gold">
          Nur Combinator
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-4 md:flex">
          <Link to="/explore" className="text-sm text-muted-foreground transition hover:text-foreground">
            Keşfet
          </Link>
          {user ? (
            <>
              <Link to="/projects/new" className="text-sm text-muted-foreground transition hover:text-foreground">
                Proje Oluştur
              </Link>
              <Link to="/me" className="text-sm text-muted-foreground transition hover:text-foreground">
                Profilim
              </Link>
              <button onClick={() => navigate('/me/notifications')} className="relative text-muted-foreground hover:text-foreground">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <button onClick={signOut} className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate('/auth')} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Giriş Yap
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-3">
            <Link to="/explore" onClick={() => setMenuOpen(false)} className="text-sm text-muted-foreground">Keşfet</Link>
            {user ? (
              <>
                <Link to="/projects/new" onClick={() => setMenuOpen(false)} className="text-sm text-muted-foreground">Proje Oluştur</Link>
                <Link to="/me" onClick={() => setMenuOpen(false)} className="text-sm text-muted-foreground">Profilim</Link>
                <Link to="/me/notifications" onClick={() => setMenuOpen(false)} className="text-sm text-muted-foreground">
                  Bildirimler {unreadCount > 0 && `(${unreadCount})`}
                </Link>
                <button onClick={() => { signOut(); setMenuOpen(false); }} className="text-sm text-left text-muted-foreground">Çıkış</button>
              </>
            ) : (
              <Button size="sm" onClick={() => { navigate('/auth'); setMenuOpen(false); }}>Giriş Yap</Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
