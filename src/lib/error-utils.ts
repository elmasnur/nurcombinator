/**
 * Maps database error codes to user-friendly Turkish messages.
 * Prevents leaking schema/table/column names to the client.
 */
export function getUserFriendlyError(error: { code?: string; message?: string } | null): string {
  if (!error) return 'Bilinmeyen bir hata oluştu.';

  switch (error.code) {
    case '23505':
      return 'Bu değer zaten kullanılıyor.';
    case '23503':
      return 'İlişkili kayıt bulunamadı.';
    case '42501':
    case 'PGRST301':
      return 'Bu işlem için yetkiniz yok.';
    case '42P17':
      return 'Bir yetkilendirme hatası oluştu. Lütfen tekrar deneyin.';
    case '23502':
      return 'Zorunlu bir alan eksik.';
    case '22P02':
      return 'Geçersiz veri formatı.';
    default:
      // Log the real error for debugging, but don't show to user
      console.error('Database error:', error.code, error.message);
      return 'İşlem başarısız oldu. Lütfen tekrar deneyin.';
  }
}
