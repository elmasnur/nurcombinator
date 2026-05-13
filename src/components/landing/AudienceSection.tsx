import { useTranslation } from 'react-i18next';
import { BookOpen, GraduationCap, Users, Code2, ChevronRight } from 'lucide-react';
import SectionHeading from './SectionHeading';

export default function AudienceSection() {
  const { t } = useTranslation();
  const items = [
    { icon: BookOpen, key: 'a1', tone: 'text-accent-amber bg-accent-amber-soft' },
    { icon: GraduationCap, key: 'a2', tone: 'text-accent-sky bg-accent-sky-soft' },
    { icon: Users, key: 'a3', tone: 'text-accent-violet bg-accent-violet-soft' },
    { icon: Code2, key: 'a4', tone: 'text-success bg-success/10' },
  ];
  return (
    <section className="bg-ivory-deep py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="Audience"
              title={t('landing.audience.headline')}
              subtitle={t('landing.audience.intro')}
              align="left"
            />
          </div>
          <div className="lg:col-span-8 grid gap-3 sm:grid-cols-2">
            {items.map(({ icon: Icon, key, tone }) => (
              <div
                key={key}
                className="group flex items-center gap-4 rounded-2xl border border-border/70 bg-ivory p-5 transition hover:-translate-y-0.5 hover:border-accent-amber/40 hover:shadow-[0_14px_30px_-18px_hsl(var(--slate-deep)/0.25)]"
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-sm font-semibold text-slate-deep md:text-base">{t(`landing.audience.${key}Title`)}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground md:text-sm">{t(`landing.audience.${key}Desc`)}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-accent-amber" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
