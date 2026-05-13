import { useTranslation } from 'react-i18next';
import { Sparkles, Pencil, Upload, TrendingUp, ShieldCheck, Globe } from 'lucide-react';
import SectionHeading from './SectionHeading';

const palettes = [
  { tint: 'bg-accent-amber-soft/55 border-accent-amber/15', num: 'bg-accent-amber text-accent-amber-foreground', icon: 'text-accent-amber' },
  { tint: 'bg-accent-sky-soft/55 border-accent-sky/15', num: 'bg-accent-sky text-accent-sky-foreground', icon: 'text-accent-sky' },
  { tint: 'bg-accent-violet-soft/55 border-accent-violet/15', num: 'bg-accent-violet text-accent-violet-foreground', icon: 'text-accent-violet' },
  { tint: 'bg-success/10 border-success/15', num: 'bg-success text-success-foreground', icon: 'text-success' },
  { tint: 'bg-accent-amber-soft/35 border-accent-amber/15', num: 'bg-accent-amber/90 text-accent-amber-foreground', icon: 'text-accent-amber' },
  { tint: 'bg-accent-sky-soft/35 border-accent-sky/15', num: 'bg-accent-sky/90 text-accent-sky-foreground', icon: 'text-accent-sky' },
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
    <section className="relative bg-ivory py-20 md:py-24 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex justify-center">
          <SectionHeading
            eyebrow="Stage Map"
            title={t('landing.stages.headline')}
            subtitle={t('landing.stages.subhead')}
          />
        </div>

        <div className="relative mt-14">
          <div aria-hidden className="absolute left-4 right-4 top-7 hidden border-t border-dashed border-border lg:block" />
          <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {stages.map(({ n, title, desc, palette, Icon }) => (
              <li
                key={n}
                className={`group relative flex h-full flex-col rounded-2xl border ${palette.tint} bg-clip-padding p-5 shadow-soft-1 transition duration-300 hover:-translate-y-1 hover:shadow-soft-2`}
              >
                <span className={`mb-4 flex h-7 w-7 items-center justify-center rounded-full font-display text-xs font-bold shadow-soft-1 ${palette.num}`}>
                  {n}
                </span>
                <h3 className="font-display text-[15px] font-semibold leading-tight text-slate-deep">{title}</h3>
                <p className="mt-1.5 flex-1 text-[12.5px] leading-[1.55] text-muted-foreground">{desc}</p>
                <div className="mt-5 flex items-end">
                  <Icon className={`h-7 w-7 opacity-80 transition group-hover:scale-110 ${palette.icon}`} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
