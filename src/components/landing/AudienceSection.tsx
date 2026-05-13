import { useTranslation } from 'react-i18next';
import { BookOpen, GraduationCap, Code2, Users, Newspaper, Rocket } from 'lucide-react';
import SectionHeading from './SectionHeading';

export default function AudienceSection() {
  const { t } = useTranslation();
  const items = [
    { icon: BookOpen, key: 'a1', accent: 'text-accent-amber' },
    { icon: GraduationCap, key: 'a2', accent: 'text-accent-sky' },
    { icon: Code2, key: 'a3', accent: 'text-accent-violet' },
    { icon: Users, key: 'a4', accent: 'text-accent-amber' },
    { icon: Newspaper, key: 'a5', accent: 'text-accent-sky' },
    { icon: Rocket, key: 'a6', accent: 'text-accent-violet' },
  ];
  return (
    <section className="bg-ivory-deep py-20 md:py-28">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Audience"
          title={t('landing.audience.headline')}
          subtitle={t('landing.audience.subhead')}
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, key, accent }) => (
            <div key={key} className="flex gap-4 rounded-2xl border border-border/70 bg-ivory p-5 transition hover:border-border">
              <Icon className={`h-6 w-6 shrink-0 ${accent}`} />
              <div>
                <h3 className="font-display text-base font-semibold text-slate-deep">{t(`landing.audience.${key}Title`)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(`landing.audience.${key}Desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}