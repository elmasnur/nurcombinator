import { Navigate, useLocation } from 'react-router-dom';
import { detectLanguage } from '@/i18n';

export default function LanguageRedirect() {
  const location = useLocation();
  const lang = detectLanguage();
  const newPath = `/${lang}${location.pathname}${location.search}${location.hash}`;
  return <Navigate to={newPath} replace />;
}
