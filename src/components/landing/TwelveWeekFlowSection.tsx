import { useTranslation } from 'react-i18next';
import SectionHeading from './SectionHeading';

export default function TwelveWeekFlowSection() {
  const { t } = useTranslation();
  const steps = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ n, label: t(`landing.flow.w${n}`) }));

  return (
    <section className="relative bg-ivory py-20 md:py-28">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Flow"
          title={t('landing.flow.headline')}
          subtitle={t('landing.flow.subhead')}
        />

        <div className="mx-auto mt-14 max-w-3xl">
          <ol className="relative space-y-4 border-l-2 border-dashed border-border pl-8">
            {steps.map((s) => (
              <li key={s.n} className="relative">
                <span className="absolute -left-[2.4rem] flex h-7 w-7 items-center justify-center rounded-full border border-border bg-ivory font-mono text-xs font-bold text-slate-deep shadow-sm">
                  {String(s.n).padStart(2, '0')}
                </span>
                <div className="rounded-xl border border-border/60 bg-card/40 px-4 py-3 backdrop-blur transition hover:bg-card">
                  <p className="text-sm font-medium text-slate-deep md:text-base">{s.label}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}