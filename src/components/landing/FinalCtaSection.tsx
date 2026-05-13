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
    <section id="basvuru" className="scroll-mt-20 bg-ivory-deep py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-deep/30 bg-slate-deep p-8 text-ivory shadow-soft-3 md:p-12 lg:p-16">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-accent-amber/15 blur-3xl" />
            <div className="absolute -right-32 -bottom-32 h-[30rem] w-[30rem] rounded-full bg-accent-violet/18 blur-3xl" />
            <div className="absolute right-1/3 -top-20 h-[22rem] w-[22rem] rounded-full bg-accent-sky/10 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, hsl(var(--accent-amber)) 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />
            {/* subtle mandala SVG accent */}
            <svg className="absolute -left-10 bottom-6 h-44 w-44 opacity-[0.08]" viewBox="0 0 100 100" fill="none" stroke="hsl(var(--accent-amber))" strokeWidth="0.4" aria-hidden>
              <circle cx="50" cy="50" r="48" />
              <circle cx="50" cy="50" r="38" />
              <circle cx="50" cy="50" r="28" />
              <circle cx="50" cy="50" r="18" />
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i * Math.PI) / 6;
                return <line key={i} x1="50" y1="50" x2={50 + 48 * Math.cos(a)} y2={50 + 48 * Math.sin(a)} />;
              })}
            </svg>
          </div>

          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-7">
              <h2 className="text-balance font-display text-[1.75rem] font-bold leading-[1.1] tracking-[-0.01em] md:text-[2.25rem] lg:text-[2.75rem]">
                {t('landing.finalCta.headline')}
              </h2>
              <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
                {checks.map((c) => (
                  <li key={c} className="flex items-start gap-2.5 text-[13.5px] text-ivory/85 md:text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-amber" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-start gap-5 lg:col-span-5 lg:items-end">
              <Button
                asChild
                size="lg"
                className="focus-ring-amber h-12 rounded-xl bg-gradient-to-b from-accent-amber to-accent-amber/85 px-7 text-accent-amber-foreground hover:from-accent-amber hover:to-accent-amber shadow-[0_18px_40px_-12px_hsl(var(--accent-amber)/0.55),inset_0_1px_0_hsl(0_0%_100%/0.35)] transition"
              >
                <Link to={user ? lp('/projects/new') : lp('/auth?redirect=/projects/new')}>
                  {t('landing.ctaConnect')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="flex items-center gap-1.5 text-sm text-ivory/65">
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
