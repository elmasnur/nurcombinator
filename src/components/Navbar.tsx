import { Link, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLocalizedNavigate, useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Bell, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useLocalizedNavigate();
  const lp = useLocalizedPath();
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    if (!user) return;
    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('read_at', null)
      .then(({ count }) => setUnreadCount(count ?? 0));
  }, [user]);

  // If we're outside /:lang routes (e.g. 404), fallback
  const prefix = lang ? `/${lang}` : '/tr';

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to={`${prefix}`} className="font-display text-xl font-bold text-gradient-gold">
          {t('nav.brand')}
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-4 md:flex">
          <Link to={`${prefix}/explore`} className="text-sm text-muted-foreground transition hover:text-foreground">
            {t('nav.explore')}
          </Link>
          <LanguageSwitcher />
          <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground transition" aria-label="Toggle theme">
            {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {user ? (
            <>
              <Link to={`${prefix}/projects/new`} className="text-sm text-muted-foreground transition hover:text-foreground">
                {t('nav.createProject')}
              </Link>
              <Link to={`${prefix}/me`} className="text-sm text-muted-foreground transition hover:text-foreground">
                {t('nav.myProfile')}
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
              {t('nav.login')}
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
            <Link to={`${prefix}/explore`} onClick={() => setMenuOpen(false)} className="text-sm text-muted-foreground">{t('nav.explore')}</Link>
            <div onClick={() => setMenuOpen(false)}><LanguageSwitcher /></div>
            <button onClick={toggleTheme} className="flex items-center gap-2 text-sm text-muted-foreground">
              {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {resolvedTheme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
            </button>
            {user ? (
              <>
                <Link to={`${prefix}/projects/new`} onClick={() => setMenuOpen(false)} className="text-sm text-muted-foreground">{t('nav.createProject')}</Link>
                <Link to={`${prefix}/me`} onClick={() => setMenuOpen(false)} className="text-sm text-muted-foreground">{t('nav.myProfile')}</Link>
                <Link to={`${prefix}/me/notifications`} onClick={() => setMenuOpen(false)} className="text-sm text-muted-foreground">
                  {t('nav.notifications')} {unreadCount > 0 && `(${unreadCount})`}
                </Link>
                <button onClick={() => { signOut(); setMenuOpen(false); }} className="text-sm text-left text-muted-foreground">{t('nav.logout')}</button>
              </>
            ) : (
              <Button size="sm" onClick={() => { navigate('/auth'); setMenuOpen(false); }}>{t('nav.login')}</Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
