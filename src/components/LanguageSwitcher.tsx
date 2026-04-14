import { useNavigate, useLocation } from 'react-router-dom';
import { SUPPORTED_LANGS, type SupportedLang, getLangFromPath } from '@/i18n';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const lang = getLangFromPath(location.pathname);

  const switchLang = () => {
    const currentIdx = SUPPORTED_LANGS.indexOf(lang);
    const nextLang = SUPPORTED_LANGS[(currentIdx + 1) % SUPPORTED_LANGS.length];
    const newPath = location.pathname.replace(/^\/[^/]+/, `/${nextLang}`);
    navigate(`${newPath}${location.search}${location.hash}`, { replace: true });
  };

  return (
    <button
      onClick={switchLang}
      className="flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
      title="Switch language"
    >
      <Globe className="h-4 w-4" />
      <span className="uppercase font-medium">{lang}</span>
    </button>
  );
}
