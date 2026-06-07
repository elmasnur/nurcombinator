import { useTranslation } from 'react-i18next';
import { Heart, Globe, Sparkles } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-ivory">
      <div className="container mx-auto px-4">
        <div className="divider-dot" aria-hidden>
          <span />
        </div>
        <div className="grid gap-6 py-10 text-sm md:grid-cols-3 md:items-center">
          <div className="flex items-center gap-3 text-muted-foreground md:justify-start">
            <BrandLogo variant="icon" className="h-6 shrink-0" />
            <span className="font-medium text-slate-deep/80">{t('landing.footerNote')}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground md:justify-center">
            <Globe className="h-4 w-4 text-accent-sky" />
            <span className="relative font-mono text-[11px] uppercase tracking-[0.24em] text-slate-deep">
              {t('landing.footerDomain')}
              <span aria-hidden className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-amber/50 to-transparent" />
            </span>
          </div>
          <div className="flex items-center gap-2 italic text-muted-foreground md:justify-end">
            <span>{t('landing.footerMotto')}</span>
            <Sparkles className="h-4 w-4 text-accent-amber" />
          </div>
        </div>
      </div>
    </footer>
  );
}
