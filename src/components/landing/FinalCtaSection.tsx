import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, LogIn } from 'lucide-react';

export default function FinalCtaSection() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const lp = useLocalizedPath();

  const checks = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'].map((k) => t(`landing.finalCta.${k}`));

  return (
    <section className="bg-ivory-deep py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl border border-slate-deep/20 bg-slate-deep p-8 text-ivory md:p-12 lg:p-14">
          {/* Mandala / glow accents */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 top-1/2 h-[26rem] w-[26rem] -translate-y-1/2 rounded-full bg-accent-amber/15 blur-3xl" />
            <div className="absolute -right-24 -bottom-24 h-[28rem] w-[28rem] rounded-full bg-accent-violet/20 blur-3xl" />
            <div className="absolute right-1/3 -top-16 h-[20rem] w-[20rem] rounded-full bg-accent-sky/10 blur-3xl" />
            {/* radial mandala dot pattern */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, hsl(var(--accent-amber)) 1px, transparent 0)',
                backgroundSize: '22px 22px',
              }}
            />
          </div>

          <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <h2 className="font-display text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
                {t('landing.finalCta.headline')}
              </h2>
              <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
                {checks.map((c) => (
                  <li key={c} className="flex items-start gap-2.5 text-sm text-ivory/90">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-amber" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-start justify-center gap-4 lg:col-span-5 lg:items-end">
              <Button
                asChild
                size="lg"
                className="bg-accent-amber text-accent-amber-foreground hover:bg-accent-amber/90 shadow-[0_18px_40px_-12px_hsl(var(--accent-amber)/0.55)]"
              >
                <Link to={user ? lp('/projects/new') : lp('/auth?redirect=/projects/new')}>
                  {t('landing.ctaConnect')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="flex items-center gap-1.5 text-sm text-ivory/70">
                <LogIn className="h-3.5 w-3.5" />
                {t('landing.loginPrompt')}{' '}
                <Link to={lp('/auth')} className="font-medium text-accent-amber underline-offset-4 hover:underline">
                  {t('landing.loginLink')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
