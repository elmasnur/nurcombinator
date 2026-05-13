import { useTranslation } from 'react-i18next';
import { Sun, Users, FileText, FlaskConical, ShieldCheck, MessageCircle, Lock, Star, ChevronRight } from 'lucide-react';
import SectionHeading from './SectionHeading';

const icons = [Sun, Users, FileText, FlaskConical, ShieldCheck, MessageCircle, Lock, Star];
const tints = [
  'bg-accent-amber-soft/45',
  'bg-accent-sky-soft/45',
  'bg-accent-violet-soft/45',
  'bg-accent-sky-soft/35',
  'bg-success/10',
  'bg-accent-amber-soft/35',
  'bg-accent-violet-soft/35',
  'bg-accent-amber-soft/55',
];
const iconTones = [
  'text-accent-amber',
  'text-accent-sky',
  'text-accent-violet',
  'text-accent-sky',
  'text-success',
  'text-accent-amber',
  'text-accent-violet',
  'text-accent-amber',
];

export default function TwelveWeekFlowSection() {
  const { t } = useTranslation();
  const steps = Array.from({ length: 8 }, (_, i) => ({
    n: i + 1,
    label: t(`landing.flow.w${i + 1}`),
    Icon: icons[i],
    tint: tints[i],
    iconTone: iconTones[i],
  }));

  return (
    <section className="relative bg-ivory py-20 md:py-24 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex justify-center">
          <SectionHeading
            eyebrow="Flow"
            title={t('landing.flow.headline')}
            subtitle={t('landing.flow.subhead')}
          />
        </div>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          {steps.map(({ n, label, Icon, tint, iconTone }, i) => (
            <div key={n} className="relative">
              <div className={`flex h-full min-h-[10.5rem] flex-col rounded-2xl border border-border/50 ${tint} p-4 shadow-soft-1 transition hover:-translate-y-0.5 hover:shadow-soft-2`}>
                <div className="mb-2 font-mono text-[11px] font-semibold tracking-[0.18em] text-muted-foreground">
                  {String(n).padStart(2, '0')}
                </div>
                <Icon className={`mb-3 h-5 w-5 ${iconTone}`} />
                <div className="h-px w-8 bg-border/70" />
                <p className="mt-2 text-[12.5px] font-medium leading-snug text-slate-deep">{label}</p>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight aria-hidden className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-border/70 lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
