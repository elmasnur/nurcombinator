import { useTranslation } from 'react-i18next';
import { Compass, Megaphone, HeartHandshake, ShieldCheck } from 'lucide-react';
import SectionHeading from './SectionHeading';

export default function ModelSection() {
  const { t } = useTranslation();
  const cards = [
    { icon: Compass, title: t('landing.model.card1Title'), desc: t('landing.model.card1Desc'), accent: 'text-accent-sky', soft: 'bg-accent-sky-soft' },
    { icon: Megaphone, title: t('landing.model.card2Title'), desc: t('landing.model.card2Desc'), accent: 'text-accent-amber', soft: 'bg-accent-amber-soft' },
    { icon: HeartHandshake, title: t('landing.model.card3Title'), desc: t('landing.model.card3Desc'), accent: 'text-accent-violet', soft: 'bg-accent-violet-soft' },
    { icon: ShieldCheck, title: t('landing.model.card4Title'), desc: t('landing.model.card4Desc'), accent: 'text-slate-deep', soft: 'bg-secondary' },
  ];
  return (
    <section className="relative bg-ivory-deep py-20 md:py-28">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Model"
          title={t('landing.model.headline')}
          subtitle={t('landing.model.subhead')}
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, title, desc, accent, soft }, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-border/70 bg-ivory p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_hsl(var(--slate-deep)/0.2)]"
            >
              <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${soft}`}>
                <Icon className={`h-5 w-5 ${accent}`} />
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-deep">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}