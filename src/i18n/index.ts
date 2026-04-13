import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import tr from './locales/tr.json';
import en from './locales/en.json';

export const SUPPORTED_LANGS = ['tr', 'en'] as const;
export type SupportedLang = typeof SUPPORTED_LANGS[number];
export const DEFAULT_LANG: SupportedLang = 'tr';

export function detectLanguage(): SupportedLang {
  const stored = localStorage.getItem('lang');
  if (stored && SUPPORTED_LANGS.includes(stored as SupportedLang)) return stored as SupportedLang;
  const browserLang = navigator.language.split('-')[0];
  if (SUPPORTED_LANGS.includes(browserLang as SupportedLang)) return browserLang as SupportedLang;
  return DEFAULT_LANG;
}

i18n.use(initReactI18next).init({
  resources: { tr: { translation: tr }, en: { translation: en } },
  lng: DEFAULT_LANG,
  fallbackLng: DEFAULT_LANG,
  interpolation: { escapeValue: false },
});

export default i18n;
