import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Heart, Clock, Users, Star } from 'lucide-react';
import ProjectSignalCard from './ProjectSignalCard';

export default function Hero() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const lp = useLocalizedPath();

  const headline = t('landing.heroHeadline');
  // Split last word "istikamet." for amber italic accent (TR). For EN fall back to last word too.
  const parts = headline.trim().split(' ');
  const last = parts.pop() ?? '';
  const head = parts.join(' ');

  const pills = [
    { icon: Clock, title: t('landing.heroPill1Title'), desc: t('landing.heroPill1Desc'), tone: 'text-accent-amber bg-accent-amber-soft' },
    { icon: Users, title: t('landing.heroPill2Title'), desc: t('landing.heroPill2Desc'), tone: 'text-accent-sky bg-accent-sky-soft' },
    { icon: Star, title: t('landing.heroPill3Title'), desc: t('landing.heroPill3Desc'), tone: 'text-accent-violet bg-accent-violet-soft' },
  ];

  return (
    <section className="relative overflow-hidden bg-ivory">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-accent-amber/15 blur-3xl" />
        <div className="absolute -right-32 top-32 h-[32rem] w-[32rem] rounded-full bg-accent-sky/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[20rem] w-[20rem] rounded-full bg-accent-violet/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto grid gap-12 px-4 py-16 lg:grid-cols-12 lg:gap-12 lg:py-24">
        <div className="lg:col-span-6 xl:col-span-7 animate-fade-in">
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-amber/30 bg-accent-amber-soft/70 px-3 py-1 text-xs font-medium text-accent-amber-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              {t('landing.heroChip1')}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-sky/30 bg-accent-sky-soft/70 px-3 py-1 text-xs font-medium text-accent-sky-foreground backdrop-blur">
              <Heart className="h-3.5 w-3.5" />
              {t('landing.heroChip2')}
            </span>
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-deep md:text-5xl lg:text-6xl xl:text-[4.25rem]">
            {head}{' '}
            <span className="italic text-accent-amber">{last}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {t('landing.heroSupport')}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-accent-amber text-accent-amber-foreground hover:bg-accent-amber/90 shadow-[0_14px_30px_-12px_hsl(var(--accent-amber)/0.55)]">
              <Link to={user ? lp('/projects/new') : lp('/auth?redirect=/projects/new')}>
                {t('landing.ctaApply')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border bg-card/60 text-slate-deep hover:bg-card backdrop-blur">
              <Link to={lp('/explore')}>
                <Users className="mr-2 h-4 w-4" />
                {t('landing.ctaMentor')}
              </Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-6 xl:col-span-5">
          <ProjectSignalCard />
        </div>

        {/* Hero pill row + metric strip */}
        <div className="lg:col-span-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {pills.map(({ icon: Icon, title, desc, tone }) => (
            <div key={title} className="rounded-2xl border border-border/70 bg-card/50 p-4 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_hsl(var(--slate-deep)/0.25)]">
              <div className="flex items-center gap-2.5">
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="font-display text-sm font-semibold text-slate-deep">{title}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
              </div>
            </div>
          ))}
          <div className="rounded-2xl border border-border/70 bg-card/50 p-4 backdrop-blur sm:col-span-1 lg:col-span-1">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-slate-deep">24</span>
              <span className="text-xs font-medium text-muted-foreground">{t('landing.heroMetric1Label')}</span>
            </div>
            <p className="mt-1 text-[11px] leading-tight text-muted-foreground">{t('landing.heroMetric1Sub')}</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card/50 p-4 backdrop-blur sm:col-span-1 lg:col-span-1">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-slate-deep">61</span>
              <span className="text-xs font-medium text-muted-foreground">{t('landing.heroMetric2Label')}</span>
            </div>
            <p className="mt-1 text-[11px] leading-tight text-muted-foreground">{t('landing.heroMetric2Sub')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
