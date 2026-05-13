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
      {/* soft grid texture */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-soft opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-accent-amber/12 blur-3xl" />
        <div className="absolute -right-40 top-24 h-[30rem] w-[30rem] rounded-full bg-accent-sky/12 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[18rem] w-[18rem] rounded-full bg-accent-violet/8 blur-3xl" />
      </div>

      <div className="container relative mx-auto grid items-center gap-12 px-4 py-16 md:py-20 lg:grid-cols-12 lg:gap-10 lg:py-28">
        <div className="lg:col-span-7 animate-fade-in">
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-accent-amber/25 bg-accent-amber-soft/80 px-3 text-xs font-medium text-accent-amber-foreground dark:text-accent-amber shadow-[inset_0_1px_0_hsl(0_0%_100%/0.6)] backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              {t('landing.heroChip1')}
            </span>
            <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-accent-sky/30 bg-accent-sky-soft/80 px-3 text-xs font-medium text-accent-sky shadow-[inset_0_1px_0_hsl(0_0%_100%/0.6)] backdrop-blur">
              <Heart className="h-3.5 w-3.5" />
              {t('landing.heroChip2')}
            </span>
          </div>

          <h1 className="text-balance font-display font-bold leading-[1.02] tracking-[-0.025em] text-slate-deep text-[2.5rem] sm:text-5xl lg:text-[4.25rem] xl:text-[4.75rem]">
            {head}{' '}
            <span className="relative inline-block italic text-accent-amber">
              {last}
              <span aria-hidden className="absolute inset-x-1 -bottom-1 h-[6px] rounded-full bg-accent-amber/15 blur-md" />
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-[15px] leading-[1.7] text-muted-foreground md:text-base lg:text-[17px]">
            {t('landing.heroSupport')}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="focus-ring-amber h-12 rounded-xl bg-gradient-to-b from-accent-amber to-accent-amber/85 px-6 text-accent-amber-foreground hover:from-accent-amber hover:to-accent-amber shadow-[0_14px_30px_-12px_hsl(var(--accent-amber)/0.55),inset_0_1px_0_hsl(0_0%_100%/0.35)] transition">
              <Link to={user ? lp('/projects/new') : lp('/auth?redirect=/projects/new')}>
                {t('landing.ctaApply')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="focus-ring-amber h-12 rounded-xl border-border/80 bg-card/60 px-6 text-slate-deep backdrop-blur transition hover:-translate-y-0.5 hover:bg-card hover:shadow-soft-2">
              <Link to={lp('/explore')}>
                <Users className="mr-2 h-4 w-4" />
                {t('landing.ctaMentor')}
              </Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <ProjectSignalCard />
        </div>

        {/* Hero pill row + metric strip */}
        <div className="lg:col-span-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {pills.map(({ icon: Icon, title, desc, tone }) => (
            <div key={title} className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-card/60 p-4 backdrop-blur transition hover:-translate-y-0.5 hover:border-accent-amber/30 shadow-soft-1 hover:shadow-soft-2">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="font-display text-[15px] font-semibold leading-tight text-slate-deep">{title}</div>
                <div className="mt-0.5 text-xs leading-snug text-muted-foreground">{desc}</div>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/60 p-4 backdrop-blur shadow-soft-1">
            <span className="font-display text-3xl font-bold leading-none text-slate-deep">24</span>
            <div className="min-w-0">
              <div className="text-xs font-medium text-slate-deep">{t('landing.heroMetric1Label')}</div>
              <p className="text-[11px] leading-tight text-muted-foreground">{t('landing.heroMetric1Sub')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/60 p-4 backdrop-blur shadow-soft-1">
            <span className="font-display text-3xl font-bold leading-none text-slate-deep">61</span>
            <div className="min-w-0">
              <div className="text-xs font-medium text-slate-deep">{t('landing.heroMetric2Label')}</div>
              <p className="text-[11px] leading-tight text-muted-foreground">{t('landing.heroMetric2Sub')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
