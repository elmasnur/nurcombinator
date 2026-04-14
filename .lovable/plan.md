

# Dil Uyumluluğu Düzeltme Planı

## Kök Neden

`Navbar` bileşeni `<Routes>` dışında render ediliyor. Bu yüzden `useParams()` hiçbir zaman `lang` parametresini alamıyor — her zaman `undefined` dönüyor. Sonuç:
- Logo her zaman `/tr`'ye yönlendiriyor (fallback)
- `LanguageSwitcher` mevcut dili okuyamıyor, sadece 1 kere çalışıyor

## Çözüm

URL'den dili okumak için `useParams` yerine `useLocation` kullanılacak. Tüm ilgili bileşenler ve hook'lar güncellenecek.

### Değişiklikler

1. **Yardımcı fonksiyon oluştur** — URL pathname'den dil kodunu parse eden bir `getLangFromPath(pathname)` fonksiyonu (`src/i18n/index.ts`'e eklenebilir)

2. **`Navbar.tsx`** — `useParams` yerine `useLocation` + `getLangFromPath` kullan. `prefix` değişkeni URL'den doğru dili alsın.

3. **`LanguageSwitcher.tsx`** — `useParams` yerine `useLocation` + `getLangFromPath` kullan. Böylece mevcut dili her zaman doğru okuyup, toggle düzgün çalışsın.

4. **`useLocalizedNavigate.ts`** — `useParams` yerine `useLocation` + `getLangFromPath` kullan. Sayfa geçişlerinde aktif dili koruyacak.

### Teknik Detay

```ts
// src/i18n/index.ts'e eklenecek
export function getLangFromPath(pathname: string): SupportedLang {
  const seg = pathname.split('/')[1];
  return SUPPORTED_LANGS.includes(seg as SupportedLang) ? seg as SupportedLang : DEFAULT_LANG;
}
```

Bu sayede `Navbar`, `LanguageSwitcher` ve `useLocalizedNavigate` her zaman URL'deki güncel dili okuyacak — `useParams`'a bağımlılık kalkacak.

