import { useTranslation } from 'react-i18next';
import { Sun, Users, FileText, FlaskConical, ShieldCheck, MessageCircle, Lock, Star, ChevronRight } from 'lucide-react';
import SectionHeading from './SectionHeading';

const icons = [Sun, Users, FileText, FlaskConical, ShieldCheck, MessageCircle, Lock, Star];
const tints = [
  'bg-accent-amber-soft/50',
  'bg-accent-sky-soft/50',
  'bg-accent-violet-soft/50',
  'bg-accent-sky-soft/40',
  'bg-success/10',
  'bg-accent-amber-soft/40',
  'bg-accent-violet-soft/40',
  'bg-accent-amber-soft/60',
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
    <section className="relative bg-ivory py-20 md:py-28">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Flow"
          title={t('landing.flow.headline')}
          subtitle={t('landing.flow.subhead')}
        />

        <div className="mt-12 grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          {steps.map(({ n, label, Icon, tint, iconTone }, i) => (
            <div key={n} className="relative">
              <div className={`flex h-full flex-col rounded-2xl border border-border/60 ${tint} p-4 transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_hsl(var(--slate-deep)/0.25)]`}>
                <div className="mb-3 font-mono text-[11px] font-semibold tracking-wider text-muted-foreground">
                  {String(n).padStart(2, '0')}
                </div>
                <Icon className={`mb-3 h-5 w-5 ${iconTone}`} />
                <p className="text-xs font-medium leading-snug text-slate-deep">{label}</p>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight aria-hidden className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-border lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
