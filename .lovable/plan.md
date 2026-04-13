

# Güncellenmiş Plan

Kullanıcı iki değişiklik istedi:
1. i18n için kütüphane kullanılması (custom context yerine)
2. URL tabanlı dil yönlendirmesi

## i18n Kütüphanesi: `react-i18next` + `i18next`

React ekosisteminde en yaygın, en stabil i18n kütüphanesi. JSON çeviri dosyaları, namespace desteği, interpolation, pluralization hepsi hazır.

## URL Tabanlı Dil Stratejisi

Dil kodu URL'nin **prefix**'i olarak eklenir:

```text
/tr/explore
/en/explore
/tr/p/proje-slug
/en/auth
```

**Öncelik sırası:**
1. URL'deki dil kodu (`/tr/...`, `/en/...`) — birincil
2. localStorage'daki kayıt — ikincil
3. Tarayıcı dili (`navigator.language`) — üçüncül
4. Varsayılan: `tr`

URL'den gelen dil hem i18next'in aktif dilini hem localStorage'ı günceller.

## Routing Yapısı

Tüm route'lar `/:lang` prefix'i altına taşınır:

```tsx
<Routes>
  {/* Dil kodu olmadan gelen → algıla ve yönlendir */}
  <Route path="/" element={<LanguageRedirect />} />
  <Route path="/auth" element={<LanguageRedirect />} />
  {/* ... diğer yollar da aynı şekilde */}

  {/* Dil kodlu route'lar */}
  <Route path="/:lang" element={<LanguageLayout />}>
    <Route index element={<Landing />} />
    <Route path="auth" element={<Auth />} />
    <Route path="explore" element={<Explore />} />
    <Route path="projects/new" element={<ProjectCreate />} />
    <Route path="p/:slug" element={<ProjectProfile />} />
    <Route path="p/:slug/dashboard" element={<ProjectDashboard />} />
    <Route path="p/:slug/open-calls/new" element={<OpenCallCreate />} />
    <Route path="open-calls/:id" element={<OpenCallDetail />} />
    <Route path="me" element={<MyProfile />} />
    <Route path="me/applications" element={<MyApplications />} />
    <Route path="me/notifications" element={<Notifications />} />
    <Route path="admin/moderation" element={<Moderation />} />
  </Route>
  <Route path="*" element={<NotFound />} />
</Routes>
```

**`LanguageRedirect`**: Dil kodu olmadan gelen URL'leri algılayıp `/:lang/...` formatına yönlendirir (localStorage → tarayıcı → `tr` sırasıyla).

**`LanguageLayout`**: `useParams` ile `lang` parametresini okur, i18next dilini ve localStorage'ı günceller, `<Outlet />` render eder. Geçersiz dil kodu gelirse varsayılana yönlendirir.

## Dosya Yapısı

```text
src/
  i18n/
    index.ts          ← i18next init (lng: 'tr', fallbackLng: 'tr')
    locales/
      tr.json         ← Tüm Türkçe stringler
      en.json         ← Tüm İngilizce stringler
  components/
    LanguageRedirect.tsx  ← Dil algılama + yönlendirme
    LanguageLayout.tsx    ← URL'den dil okuma + i18next senkronizasyonu + Outlet
    LanguageSwitcher.tsx  ← Navbar'daki TR/EN toggle
```

## Uygulama Adımları

### Adım 1: i18next Kurulumu
- `react-i18next` ve `i18next` paketlerini ekle
- `src/i18n/index.ts` oluştur: i18next'i JSON import ile yapılandır
- `src/main.tsx`'e i18n import'u ekle

### Adım 2: Çeviri Dosyaları
- `tr.json` ve `en.json` oluştur — Navbar, Landing, Explore, Auth, form etiketleri, hata mesajları, evre/tür/çağrı etiketleri dahil tüm UI stringleri
- `src/lib/types.ts`'deki label map'leri i18n key'lerine dönüştür

### Adım 3: URL Tabanlı Routing
- `LanguageRedirect` bileşeni: dil kodu olmayan path'leri algılayıp `/:lang/path` formatına `<Navigate>` ile yönlendir
- `LanguageLayout` bileşeni: `useParams().lang` oku → i18next dil değiştir → localStorage güncelle → `<Outlet />`
- `App.tsx`'de route yapısını `/:lang` prefix'li nested yapıya çevir

### Adım 4: Navbar ve Dil Değiştirici
- `LanguageSwitcher` bileşeni: mevcut URL'deki dil kodunu değiştirerek yönlendirir (ör. `/tr/explore` → `/en/explore`)
- Navbar'a ekle

### Adım 5: Tüm Bileşenlerde `t()` Kullanımı
- Tüm sayfa ve bileşenlerdeki hardcoded Türkçe stringler `useTranslation()` hook'u ile `t('key')` çağrısına dönüştürülür
- Link/navigate çağrıları `/:lang/` prefix'ini içerecek şekilde güncellenir — bunun için `useLocalizedNavigate` gibi bir yardımcı hook oluşturulabilir

### Adım 6: Diğer 3 Özellik (Tema, Arama, E-posta)
- Önceki planda anlatıldığı gibi uygulanır, değişiklik yok

## Teknik Notlar
- Desteklenen diller: `['tr', 'en']` — dizi olarak merkezi tanım
- `/:lang` parametresinde geçersiz değer gelirse → `tr`'ye yönlendir
- Tüm internal `<Link>` ve `navigate()` çağrıları aktif dil prefix'ini içermeli
- `error-utils.ts`'deki Türkçe hata mesajları da i18n key'lerine taşınır

