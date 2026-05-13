
# Landing Sayfası Redesign — Audit Raporu

## 1. Mevcut Route / Dosya Haritası

**Genel public landing route'u:**
- `/` ve `/:lang` (örn. `/tr`, `/en`) → `LanguageRedirect` → `LanguageLayout` → `<Landing />`
- Tanım: `src/App.tsx` (satır 36, 50–51)
- Bileşen: `src/pages/Landing.tsx`

**Landing bileşeninin doğrudan bağımlılıkları:**
- `src/components/Navbar.tsx` (global, App.tsx içinde Routes dışında render — landing dahil her sayfada görünür)
- `src/components/LanguageLayout.tsx` (i18n wrapper, dil senkronizasyonu)
- `src/components/LanguageSwitcher.tsx` (Navbar içinden)
- `src/components/ui/button.tsx` (shadcn)
- `src/hooks/useAuth.tsx`, `src/hooks/useLocalizedNavigate.ts`, `src/hooks/useTheme.ts`
- i18n kaynakları: `src/i18n/index.ts`, `src/i18n/locales/{tr,en}.json` (`landing.*` anahtarları)
- İkonlar: `lucide-react` (`ArrowRight`, `Shield`, `Users`, `Compass`)

**Landing'in mevcut bölümleri (Landing.tsx):**
1. Hero (title, subtitle, iki CTA)
2. How It Works — 3 adım
3. Principles — 3 ilke (Shield/Compass/Users)
4. Footer (basit metin)

> AGENTS.md kanonik yapısına göre mevcut sayfada **eksik**: Project Signal dashboard kartı, Model section (4 kart), Stage Map (6 evre), Audience section, 12-Week Flow (8 adım), güçlü Final CTA.

## 2. Global Styling / Theme Gözlemleri

- `src/index.css` — light tema zaten warm ivory (`--background: 40 20% 97%`) + amber primary (`--primary: 40 72% 42%` gold) üzerine kurulu. Foreground deep slate (`220 20% 12%`). `.dark` varyantı tanımlı.
- Custom tokens: `--gold`, `--gold-dim`, `--gold-glow`, `--surface-raised`, `--success`, `--warning`, `--info`. Utility'ler: `text-gradient-gold`, `glow-gold`, `surface-raised`.
- `tailwind.config.ts` — semantic token'lar map'lenmiş, `gold` rengi extend edilmiş, fontlar (`Playfair Display` display, `Open Sans` sans, `Crimson Pro` serif, `Roboto Mono` mono), `fade-in` ve `shimmer` animasyonları tanımlı.
- Yeni redesign için **eksik token'lar**: sky accent, violet accent. Bunlar `index.css` + `tailwind.config.ts`'e HSL semantic token olarak eklenmeli.
- Animasyon: yalnızca `tailwindcss-animate` mevcut. Framer-motion / GSAP yok.

## 3. Reuse vs Rebuild Tavsiyesi

**Tavsiye: Componentized Rebuild (Landing'e özel).**

Sebepler:
- Mevcut `Landing.tsx` tek dosya, kanonik yapının yalnızca ~%30'unu karşılıyor (3 bölüm vs gereken 8).
- Project Signal kartı, Stage Map, 12-Week Flow gibi bölümler özgün, tekrar kullanılabilir landing bileşenleri olarak en temiz şekilde yeni dosyalara bölünür.
- Mevcut hero copy ve i18n key yapısı (`landing.*`) **korunabilir ve genişletilebilir** — i18n kontratı tamamen yeniden yazılmamalı, üstüne eklenmeli.

Yeniden kullanılacaklar:
- `Navbar`, `Button`, `Card` (shadcn), `Badge`, `Progress`, semantic Tailwind token'ları, mevcut i18n altyapısı, `useAuth`, `useLocalizedPath`.

Yeniden inşa edilecek:
- `Landing.tsx` (orchestrator — sadece sectionları sırasıyla render eden ince dosya)
- Her section ayrı bileşen → `src/components/landing/` altında.

## 4. Önerilen Dosya Değişiklikleri / Yenileri

**Düzenlenecek (3):**
- `src/pages/Landing.tsx` — sadeleştir, yeni section bileşenlerini compose et.
- `src/index.css` — sky/violet accent token'ları (`--accent-sky`, `--accent-violet` ve `-foreground` varyantları) ekle, hem `:root` hem `.dark` için.
- `tailwind.config.ts` — yeni accent token'larını `colors` extend'ine ekle.
- `src/i18n/locales/tr.json` ve `src/i18n/locales/en.json` — yeni section'lar için `landing.*` anahtarları ekle (model, stages, audience, flow, signal, finalCta). Mevcut anahtarlar korunur.

**Oluşturulacak (`src/components/landing/`):**
- `Hero.tsx` — kanonik Türkçe headline + supporting copy + ana CTA'lar.
- `ProjectSignalCard.tsx` — premium glass dashboard kartı (Evre/İhtiyaç/Sinyal/Risk + progress + 2 metric kart). UI placeholder verisi statik.
- `ModelSection.tsx` — 4 kart (Evre Tespiti, İhtiyaç Pazarı, Mentor & Peer Match, Emanet Filtresi).
- `StageMapSection.tsx` — 6 olgunlaşma evresi (yatay/dikey timeline).
- `AudienceSection.tsx` — hedef proje türleri grid.
- `TwelveWeekFlowSection.tsx` — 8 adımlık akış.
- `FinalCtaSection.tsx` — kanonik headline + "Connect'e Başla" + login linki.
- `Footer.tsx` — elegant microcopy (`İyiliği artıran her proje…`, `connect.nurai.app`).
- (Opsiyonel) `src/components/landing/SectionHeading.tsx` — paylaşılan başlık.

**Dokunulmayacak:**
- `src/App.tsx` route tablosu (yalnızca Landing'in kendisi değişir; route ve bileşen adı aynı).
- `Navbar`, `LanguageLayout`, `LanguageRedirect`, auth, queries, supabase entegrasyonu, edge functions, migrations.
- Tüm `/:lang/*` korumalı uygulama route'ları: `auth`, `explore`, `projects/new`, `p/:slug`, `p/:slug/dashboard`, `p/:slug/open-calls/new`, `open-calls/:id`, `me`, `me/applications`, `me/notifications`, `admin/moderation`.

## 5. Mevcut Bağımlılıklar

- **UI**: shadcn/ui (radix tabanlı, tüm temel parçalar mevcut: Card, Button, Badge, Progress, Tabs, vb.)
- **İkonlar**: `lucide-react` ^0.462 — yeterli.
- **Motion**: yok. AGENTS.md "subtle entrance + hover" istiyor → **framer-motion eklenmesi önerilir** (yalnızca landing için, küçük bağımlılık). Alternatif: sadece Tailwind keyframe + `tailwindcss-animate` ile yetinmek (motion'sız da kanonik kuralları karşılar).
- **Tailwind**: v3.4 + animate plugin, typography plugin mevcut. Konfigürasyon HSL semantic token kuralına uyumlu.

## 6. Riskler

- **i18n drift**: Çok sayıda yeni `landing.*` key'i geliyor; iki dilde birbirine eşit tutulmazsa runtime'da key görünür. → Aynı anda hem `tr.json` hem `en.json` güncellenmeli.
- **Token genişletmesi**: sky/violet accent eklenirken dark mod karşılıkları unutulursa kontrast bozulur. → Her token `:root` + `.dark`'a paralel eklenecek.
- **Motion bağımlılığı kararı**: framer-motion eklenecekse bundle ~50KB artar. Kullanıcı onayı alınmalı.
- **Glassmorphism + light tema**: warm ivory zeminde glass efektin görünür olması için gölge/blur değerlerinin dikkatli ayarı gerekir. Tasarım yönü için isteğe bağlı `design--create_directions` adımı önerilir.
- **Mevcut sade landing'in trafiği**: redesign yayına çıktığında mevcut linkler / SEO meta'ları (index.html title/desc) güncel tutulmalı; bu plan kapsamına alınabilir.

## 7. Checklist

- [x] Mevcut landing route belirlendi: `/:lang` index → `src/pages/Landing.tsx`
- [x] Sayfayı kontrol eden dosyalar listelendi (Landing.tsx + Navbar + i18n + tema)
- [x] Global stil/tema dosyaları belirlendi (`src/index.css`, `tailwind.config.ts`)
- [x] Bağımlılıklar kontrol edildi (shadcn, lucide, react-i18next, motion yok)
- [x] Korunacak auth/app route'ları listelendi (kapsam dışı)
- [x] Bu adımda redesign uygulanmadı; sadece audit + plan üretildi.
