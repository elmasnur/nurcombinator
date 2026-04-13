import { useNavigate, useParams } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Returns a navigate function that auto-prepends the current /:lang prefix.
 * Use for internal navigation: localizedNavigate('/explore') → /<lang>/explore
 */
export function useLocalizedNavigate() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();

  const localizedNavigate = useCallback(
    (path: string, options?: { replace?: boolean; state?: any }) => {
      // If path already starts with /<lang>/ just navigate directly
      if (path.startsWith(`/${lang}/`) || path === `/${lang}`) {
        navigate(path, options);
      } else {
        const prefix = `/${lang ?? 'tr'}`;
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        navigate(`${prefix}${cleanPath}`, options);
      }
    },
    [navigate, lang],
  );

  return localizedNavigate;
}

/**
 * Build a localized path for use in <Link to={...}>
 */
export function useLocalizedPath() {
  const { lang } = useParams<{ lang: string }>();
  return useCallback(
    (path: string) => {
      const prefix = `/${lang ?? 'tr'}`;
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return `${prefix}${cleanPath}`;
    },
    [lang],
  );
}
