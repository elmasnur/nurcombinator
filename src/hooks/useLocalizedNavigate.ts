import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';
import { getLangFromPath } from '@/i18n';

export function useLocalizedNavigate() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const lang = getLangFromPath(pathname);

  return useCallback(
    (path: string, options?: { replace?: boolean; state?: any }) => {
      if (path.startsWith(`/${lang}/`) || path === `/${lang}`) {
        navigate(path, options);
      } else {
        const prefix = `/${lang}`;
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        navigate(`${prefix}${cleanPath}`, options);
      }
    },
    [navigate, lang],
  );
}

export function useLocalizedPath() {
  const { pathname } = useLocation();
  const lang = getLangFromPath(pathname);

  return useCallback(
    (path: string) => {
      const prefix = `/${lang}`;
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return `${prefix}${cleanPath}`;
    },
    [lang],
  );
}
