import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProjectSignalCard from './ProjectSignalCard';

export default function Hero() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const lp = useLocalizedPath();

  return (
    <section className="relative overflow-hidden bg-ivory">
      {/* Ambient gradient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-accent-amber/15 blur-3xl" />
        <div className="absolute -right-32 top-32 h-[32rem] w-[32rem] rounded-full bg-accent-sky/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[20rem] w-[20rem] rounded-full bg-accent-violet/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto grid gap-12 px-4 py-20 lg:grid-cols-12 lg:gap-16 lg:py-28">
        <div className="lg:col-span-6 xl:col-span-7 animate-fade-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent-amber" />
            {t('landing.heroEyebrow')}
          </div>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-deep md:text-5xl lg:text-6xl xl:text-7xl">
            {t('landing.heroHeadline')}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {t('landing.heroSupport')}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-slate-deep text-ivory hover:bg-slate-deep/90 shadow-[0_10px_30px_-10px_hsl(var(--slate-deep)/0.5)]">
              <Link to={user ? lp('/projects/new') : lp('/auth?redirect=/projects/new')}>
                {t('landing.ctaPosition')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border bg-card/60 text-slate-deep hover:bg-card backdrop-blur">
              <Link to={lp('/explore')}>{t('landing.ctaApply')}</Link>
            </Button>
          </div>
          <div className="mt-6 text-sm text-muted-foreground">
            <Link to={lp('/auth')} className="underline-offset-4 hover:text-slate-deep hover:underline">
              {t('landing.ctaMentor')}
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6 xl:col-span-5">
          <ProjectSignalCard />
        </div>
      </div>
    </section>
  );
}