import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLocalizedNavigate, useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Bell, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getLangFromPath } from '@/i18n';
import BrandLogo from '@/components/BrandLogo';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useLocalizedNavigate();
  const lp = useLocalizedPath();
  const { t } = useTranslation();
  const location = useLocation();
  const lang = getLangFromPath(location.pathname);
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

  const prefix = `/${lang}`;
  const isLanding = location.pathname === prefix || location.pathname === `${prefix}/`;
  const landingAnchors = [
    { hash: '#model', label: t('nav.model') },
    { hash: '#evreler', label: t('nav.stages') },
    { hash: '#program', label: t('nav.program') },
    { hash: '#basvuru', label: t('nav.apply') },
  ];

  const scrollToHash = (hash: string) => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to={prefix} aria-label={t('nav.brand')} className="flex items-center">
          <BrandLogo variant="icon" className="h-8 sm:hidden" />
          <BrandLogo variant="full" className="hidden h-7 sm:inline-flex" />
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-4 md:flex">
          {isLanding && landingAnchors.map(({ hash, label }) => (
            <a
              key={hash}
              href={hash}
              onClick={(e) => { e.preventDefault(); scrollToHash(hash); history.replaceState(null, '', `${location.pathname}${hash}`); }}
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              {label}
            </a>
          ))}
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
            {isLanding && landingAnchors.map(({ hash, label }) => (
              <a
                key={hash}
                href={hash}
                onClick={(e) => { e.preventDefault(); setMenuOpen(false); setTimeout(() => scrollToHash(hash), 50); history.replaceState(null, '', `${location.pathname}${hash}`); }}
                className="text-sm text-muted-foreground"
              >
                {label}
              </a>
            ))}
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
