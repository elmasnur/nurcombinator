import { useTranslation } from 'react-i18next';
import SectionHeading from './SectionHeading';

export default function StageMapSection() {
  const { t } = useTranslation();
  const stages = [1, 2, 3, 4, 5, 6].map((n) => ({
    n,
    title: t(`landing.stages.s${n}Title`),
    desc: t(`landing.stages.s${n}Desc`),
  }));

  return (
    <section className="relative bg-ivory py-20 md:py-28">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Stage Map"
          title={t('landing.stages.headline')}
          subtitle={t('landing.stages.subhead')}
        />

        <div className="relative mt-14">
          <div aria-hidden className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />
          <ol className="grid gap-6 lg:grid-cols-6">
            {stages.map((s) => (
              <li key={s.n} className="relative rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-deep font-display text-sm font-bold text-ivory">
                    {s.n}
                  </div>
                  <div className="h-px flex-1 bg-border/70" />
                </div>
                <h3 className="font-display text-base font-semibold text-slate-deep">{s.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}