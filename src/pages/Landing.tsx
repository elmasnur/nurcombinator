import { Link, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Users, Compass } from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const lp = useLocalizedPath();

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <div className="animate-fade-in max-w-2xl">
          <h1 className="mb-6 font-display text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
            <span className="text-gradient-gold">{t('landing.title')}</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
            {t('landing.subtitle')}
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-gold">
              <Link to={lp('/explore')}>
                {t('landing.exploreBtn')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-border text-foreground hover:bg-secondary">
              <Link to={user ? lp('/projects/new') : lp('/auth?redirect=/projects/new')}>{t('landing.createBtn')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-10 text-center font-display text-2xl font-bold">{t('landing.howItWorks')}</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { num: 1, title: t('landing.step1Title'), desc: t('landing.step1Desc') },
              { num: 2, title: t('landing.step2Title'), desc: t('landing.step2Desc') },
              { num: 3, title: t('landing.step3Title'), desc: t('landing.step3Desc') },
            ].map(s => (
              <div key={s.num} className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold">{s.num}</div>
                <h3 className="mb-1 font-display text-base font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-t border-border bg-card/50 px-4 py-16">
        <div className="container mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {[
            { icon: <Shield className="h-5 w-5 text-accent-foreground" />, title: t('landing.securityTitle'), desc: t('landing.securityDesc') },
            { icon: <Compass className="h-5 w-5 text-accent-foreground" />, title: t('landing.stageTitle'), desc: t('landing.stageDesc') },
            { icon: <Users className="h-5 w-5 text-accent-foreground" />, title: t('landing.networkTitle'), desc: t('landing.networkDesc') },
          ].map((p, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">{p.icon}</div>
              <h3 className="mb-1 font-display text-base font-semibold">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
        {t('landing.footer')}
      </footer>
    </div>
  );
}
