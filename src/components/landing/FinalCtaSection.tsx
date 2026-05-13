import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function FinalCtaSection() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const lp = useLocalizedPath();

  return (
    <section className="relative overflow-hidden bg-ivory-deep py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-accent-amber/20 via-accent-violet/10 to-transparent blur-3xl" />
      </div>
      <div className="container relative mx-auto max-w-4xl px-4 text-center">
        <h2 className="font-display text-3xl font-bold leading-tight text-slate-deep md:text-4xl lg:text-5xl">
          {t('landing.finalCta.headline')}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
          {t('landing.finalCta.support')}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="bg-slate-deep text-ivory hover:bg-slate-deep/90 ring-soft-amber">
            <Link to={user ? lp('/projects/new') : lp('/auth?redirect=/projects/new')}>
              {t('landing.ctaConnect')} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          {t('landing.loginPrompt')}{' '}
          <Link to={lp('/auth')} className="font-medium text-slate-deep underline-offset-4 hover:underline">
            {t('landing.loginLink')}
          </Link>
        </p>
      </div>
    </section>
  );
}