import { useTranslation } from 'react-i18next';
import { Heart, Globe, Sparkles } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border bg-ivory">
      <div className="container mx-auto grid gap-6 px-4 py-8 text-sm md:grid-cols-3 md:items-center">
        <div className="flex items-center gap-2 text-muted-foreground md:justify-start">
          <Heart className="h-4 w-4 text-accent-amber" />
          <span>{t('landing.footerNote')}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground md:justify-center">
          <Globe className="h-4 w-4 text-accent-sky" />
          <span className="font-mono text-xs uppercase tracking-[0.18em]">{t('landing.footerDomain')}</span>
        </div>
        <div className="flex items-center gap-2 italic text-muted-foreground md:justify-end">
          <span>{t('landing.footerMotto')}</span>
          <Sparkles className="h-4 w-4 text-accent-amber" />
        </div>
      </div>
    </footer>
  );
}
