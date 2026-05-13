import { useTranslation } from 'react-i18next';
import { Sparkles, Pencil, Upload, TrendingUp, ShieldCheck, Globe } from 'lucide-react';
import SectionHeading from './SectionHeading';

const palettes = [
  { tint: 'bg-accent-amber-soft/60 border-accent-amber/20', num: 'bg-accent-amber text-accent-amber-foreground', icon: 'text-accent-amber' },
  { tint: 'bg-accent-sky-soft/60 border-accent-sky/20', num: 'bg-accent-sky text-accent-sky-foreground', icon: 'text-accent-sky' },
  { tint: 'bg-accent-violet-soft/60 border-accent-violet/20', num: 'bg-accent-violet text-accent-violet-foreground', icon: 'text-accent-violet' },
  { tint: 'bg-success/10 border-success/20', num: 'bg-success text-success-foreground', icon: 'text-success' },
  { tint: 'bg-accent-amber-soft/40 border-accent-amber/20', num: 'bg-accent-amber/90 text-accent-amber-foreground', icon: 'text-accent-amber' },
  { tint: 'bg-accent-sky-soft/40 border-accent-sky/20', num: 'bg-accent-sky/90 text-accent-sky-foreground', icon: 'text-accent-sky' },
];

const icons = [Sparkles, Pencil, Upload, TrendingUp, ShieldCheck, Globe];

export default function StageMapSection() {
  const { t } = useTranslation();
  const stages = [1, 2, 3, 4, 5, 6].map((n, i) => ({
    n,
    title: t(`landing.stages.s${n}Title`),
    desc: t(`landing.stages.s${n}Desc`),
    palette: palettes[i],
    Icon: icons[i],
  }));

  return (
    <section className="relative bg-ivory py-20 md:py-28">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Stage Map"
          title={t('landing.stages.headline')}
          subtitle={t('landing.stages.subhead')}
        />

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {stages.map(({ n, title, desc, palette, Icon }) => (
            <li
              key={n}
              className={`relative flex flex-col rounded-2xl border ${palette.tint} p-5 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_hsl(var(--slate-deep)/0.25)]`}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full font-display text-xs font-bold ${palette.num}`}>
                  {n}
                </span>
              </div>
              <h3 className="font-display text-base font-semibold text-slate-deep">{title}</h3>
              <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>
              <div className="mt-4 flex justify-start">
                <Icon className={`h-7 w-7 opacity-80 ${palette.icon}`} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
