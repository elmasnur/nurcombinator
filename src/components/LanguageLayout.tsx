import { useEffect } from 'react';
import { Outlet, useParams, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGS, DEFAULT_LANG, type SupportedLang } from '@/i18n';

export default function LanguageLayout() {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const location = useLocation();

  const isValid = lang && SUPPORTED_LANGS.includes(lang as SupportedLang);

  useEffect(() => {
    if (isValid && i18n.language !== lang) {
      i18n.changeLanguage(lang);
      localStorage.setItem('lang', lang!);
    }
  }, [lang, isValid, i18n]);

  if (!isValid) {
    // Replace invalid lang prefix with default
    const rest = location.pathname.replace(/^\/[^/]+/, '');
    return <Navigate to={`/${DEFAULT_LANG}${rest}${location.search}${location.hash}`} replace />;
  }

  return <Outlet />;
}
