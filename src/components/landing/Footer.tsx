import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border bg-ivory">
      <div className="container mx-auto flex flex-col items-center gap-3 px-4 py-10 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p className="font-display text-base font-semibold text-slate-deep">{t('landing.footerNote')}</p>
          <p className="mt-1 text-sm italic text-muted-foreground">{t('landing.footerMotto')}</p>
        </div>
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {t('landing.footerDomain')}
        </div>
      </div>
    </footer>
  );
}