# Kalan 3 Özellik Uygulama Planı

Çoklu dil desteği zaten tamamlandı (react-i18next + URL routing). Aşağıdaki 3 özellik uygulanacak.

---

## 1. Karanlık/Aydınlık Tema Desteği

Mevcut CSS değişkenleri yalnızca koyu tema içeriyor. Aydınlık tema eklenecek.

- `**src/index.css**`: Mevcut `:root` değişkenlerini aydınlık tema değerleri olarak ayarla, koyu tema değişkenlerini `.dark` altına taşı
- `**src/hooks/useTheme.ts**` (yeni): localStorage'dan tema oku, sistem tercihini kontrol et, `<html>` elementine `.dark` class'ı ekle/kaldır
- `**src/components/Navbar.tsx**`: Sun/Moon toggle butonu ekle
- `**index.html**`: İlk yüklemede flash önlemek için script ile `dark` class kontrolü

Aydınlık tema renkleri: beyaz/krem arka plan, koyu metin, altın vurgular korunacak.

---

## 2. Gelişmiş Arama

### Veritabanı Değişiklikleri (Migration)

- `projects` tablosuna `fts` tsvector sütunu + GIN index + trigger (title + summary + description üzerinden)
- `open_calls` tablosuna `fts` tsvector sütunu + GIN index + trigger (title + description üzerinden)
- Mevcut verileri doldurmak için UPDATE ifadesi

### Kod Değişiklikleri

- `**src/lib/queries.ts**`: `textSearch()` fonksiyonu ile tam metin arama, `contains` ile çoklu tag filtresi
- `**src/pages/Explore.tsx**`: 
  - Tag input'u multi-select chip arayüzüne dönüştür
  - Debounce ile arama optimizasyonu
  - Konum filtresi (open calls için location_mode zaten var, projects için de eklenebilir)

---

## 3. E-posta Bildirimleri (Resend)

Haftalık özet e-postası birden fazla kullanıcıya gönderildiği için bu bir toplu/bülten e-postasıdır. Resend entegrasyonu ile yapılacak.

### Kurulum

- Resend connector'ü bağla (kullanıcıdan API key istenecek)
- `email_preferences` tablosu oluştur (user_id, weekly_digest, language)

### Edge Function: `send-weekly-digest`

- Son 7 günde eklenen yeni projeleri sorgula
- Aktif açık çağrıları listele
- Opt-in kullanıcılara Resend gateway üzerinden HTML e-posta gönder
- E-posta içeriği: yeni projeler, öne çıkan açık çağrılar, platform haberleri

### Zamanlama

- `pg_cron` + `pg_net` ile haftalık (her Pazartesi) cron job

### İşlem Bazlı Bildirimler (Lovable Email)

- Yeni başvuru geldiğinde proje sahibine e-posta
- Başvuru durumu değiştiğinde başvurana e-posta
- Lovable'ın yerleşik e-posta altyapısı kullanılacak

### Profil Sayfası

- `MyProfile.tsx`'e e-posta tercih toggle'ı ekle (haftalık özet açık/kapalı)

---

## Uygulama Sırası

1. Tema toggle (DB değişikliği yok, hızlı)
2. Gelişmiş arama (DB migration + UI)
3. E-posta bildirimleri (Resend bağlantısı + DB + Edge Functions)