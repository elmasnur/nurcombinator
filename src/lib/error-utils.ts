import i18n from '@/i18n';

/**
 * Maps database error codes to user-friendly messages using i18n.
 */
export function getUserFriendlyError(error: { code?: string; message?: string } | null): string {
  if (!error) return i18n.t('errors.unknown');

  const key = `errors.${error.code}`;
  const translated = i18n.t(key);
  if (translated !== key) return translated;

  // Log the real error for debugging, but don't show to user
  console.error('Database error:', error.code, error.message);
  return i18n.t('errors.default');
}
