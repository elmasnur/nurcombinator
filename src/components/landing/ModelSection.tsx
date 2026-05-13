import { useTranslation } from 'react-i18next';
import { Compass, Megaphone, HeartHandshake, ShieldCheck } from 'lucide-react';
import SectionHeading from './SectionHeading';

export default function ModelSection() {
  const { t } = useTranslation();
  const cards = [
    { icon: Compass, title: t('landing.model.card1Title'), desc: t('landing.model.card1Desc'), accent: 'text-accent-amber', soft: 'bg-accent-amber-soft' },
    { icon: Megaphone, title: t('landing.model.card2Title'), desc: t('landing.model.card2Desc'), accent: 'text-accent-sky', soft: 'bg-accent-sky-soft' },
    { icon: HeartHandshake, title: t('landing.model.card3Title'), desc: t('landing.model.card3Desc'), accent: 'text-accent-violet', soft: 'bg-accent-violet-soft' },
    { icon: ShieldCheck, title: t('landing.model.card4Title'), desc: t('landing.model.card4Desc'), accent: 'text-accent-amber', soft: 'bg-accent-amber-soft' },
  ];
  return (
    <section className="relative bg-ivory-deep py-20 md:py-24 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex justify-center">
          <SectionHeading
            eyebrow="Model"
            title={t('landing.model.headline')}
            subtitle={t('landing.model.subhead')}
          />
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, title, desc, accent, soft }, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-border/60 bg-ivory p-7 shadow-soft-1 transition duration-300 hover:-translate-y-1 hover:border-accent-amber/30 hover:shadow-soft-2"
            >
              <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full ${soft}`}>
                <Icon className={`h-5 w-5 ${accent}`} />
              </div>
              <h3 className="font-display text-[17px] font-semibold leading-tight text-slate-deep">{title}</h3>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
