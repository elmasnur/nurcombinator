## Hedef

Landing sayfasını "vibe-coded / template" hissinden çıkarıp daha premium, editöryel ve karakterli bir hâle getirmek. Aynı zamanda dark temada kart sınırlarının zar zor görünmesi sorununu giderecek token ayarlamaları yapmak.

Yapı, içerik ve backend'e dokunulmayacak. Sadece görsel katman (tokens + presentation katmanı).

---

## 1) Dark tema görünürlük (token seviyesinde)

`src/index.css` içinde dark blok güncellenecek:

- `--border`: `220 14% 18%` → `220 14% 26%` (kartlar belirginleşir)
- `--input`: aynı şekilde `26%`
- `--card`: `220 18% 10%` → `220 18% 12%` (zeminden hafif yukarı çıksın)
- `--surface-raised`: `220 16% 12%` → `220 16% 15%`
- `--ivory` (dark): `220 18% 10%` → `220 18% 11%`
- `--ivory-deep` (dark): `220 20% 7%` → `220 20% 6%` (kontrast artar — kart "yüzeyde" durur)
- `--muted-foreground`: `220 10% 55%` → `220 10% 62%` (alt metin okunaklığı)

Light tema değerlerine dokunulmayacak.

## 2) Premium yüzey tokenları (yeni, küçük ekleme)

`src/index.css` `@layer utilities` bölümüne eklenecek yeni yardımcılar — her yerde tutarlı premium dokunuş için:

- `.surface-premium` — hafif iç ışık + ince üst çizgi (light: beyaz reflektans, dark: sıcak amber reflektans):
  ```
  background: linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--card)/0.92) 100%);
  box-shadow: inset 0 1px 0 hsl(0 0% 100% / 0.04), 0 1px 2px hsl(var(--slate-deep)/0.04);
  ```
- `.ring-premium` — odak/hover için altın ince halka.
- `.hairline-top` — kartların üstünde tek pikselik altın gradient çizgi (premium katalog hissi).
- `.noise-soft` — çok düşük opaklıkta SVG grain (kâğıt dokusu); `bg-ivory` ve `bg-ivory-deep` üstüne overlay olarak uygulanacak.
- `.text-display-tight` — başlıklar için `tracking: -0.035em` + `font-feature-settings: "ss01","ss02"` (Playfair'ı daha editöryel gösterir).

## 3) Hero premium dokunuşları

`src/components/landing/Hero.tsx`:

- Headline'a `text-display-tight` ve italic vurguya ince altın alt-çizgi (gradient) yerine zarif "swash" altı gölge.
- `heroChip` chip'lerine `hairline-top` + ince border parlaklığı.
- Pill row kartlarına `surface-premium` + dark modda `border-white/8` benzeri açık kontur.
- Sağ alandaki yumuşak blob'lar dark modda `opacity-25` → `opacity-15` (zemini kirletmesin), light'ta dokunulmaz.
- Metrik kartlarındaki rakamlara hafif `text-gradient-warm` ve `tabular-nums`.

## 4) Project Signal kartı

`src/components/landing/ProjectSignalCard.tsx`:

- Dış glow halkasını dark modda yumuşatmak (renk değil opaklık).
- Kart kenarına `hairline-top` (üstünde altın ince çizgi).
- "live" rozetine `surface-premium` + ping animasyonunu daha kısa süre.
- İlerleme çubuklarının arka planı dark'ta `bg-border/50` → `bg-white/8` (daha temiz).

## 5) Model / Stage Map / Audience / 12-Week kart border'ları

Tüm kartlardaki `border border-border/60` veya `/70` kullanımları:

- Light'ta aynı kalır.
- Dark'ta token seviyesindeki `--border` artırımı sayesinde otomatik belirginleşir; ek olarak hover'da `hover:border-accent-amber/40` → `hover:border-accent-amber/55` yapılır.
- Kartlara `surface-premium` utility'si eklenir (sadece sınıf eklenecek; mevcut `bg-ivory` korunur).
- Stage Map'teki dashed connector çizgisi dark'ta `border-border` → `border-white/10` (daha doğal akış).

## 6) Final CTA bandı

`src/components/landing/FinalCtaSection.tsx`:

- `bg-slate-deep` üstüne çok ince noise overlay (`.noise-soft`) eklenir — düz renk yerine kumaşlı doku.
- Başlığa `text-display-tight`.
- Altın gradient buton'a iç highlight + dış sıcak gölge zaten var; `focus-ring-amber` korunur.
- Köşe radius `2rem` → `2.25rem` (daha "monolitik" his).

## 7) Footer

`src/components/landing/Footer.tsx`:

- Üst divider `divider-fade` üstüne minik ortalanmış altın nokta (Risale-i Nur'a uygun zarif separator).
- Domain etiketine `font-mono` korunur, harf aralığı +0.02em.

## 8) Tipografi mikro-ayarları

`src/index.css` body/headings:

- `body` için `font-feature-settings: "cv11","ss01"` (rakamların tutarlılığı).
- `h1, h2, h3` için `text-rendering: geometricPrecision`.
- Tabular sayılar için `.tabular-nums { font-variant-numeric: tabular-nums; }` (Hero metriklerinde, Signal yüzdelerinde kullanılacak).

---

## Dokunulmayacaklar

- Sayfa yapısı, route'lar, içerik metinleri (i18n keys).
- Backend / Supabase / RLS / auth.
- Mevcut renk paleti tonu (gold/amber kimliği aynı).
- Light tema hiçbir token değişmez (sadece utility eklemeleri).
- Yeni bağımlılık eklenmeyecek (motion / GSAP eklenmez — mevcut Tailwind animate ile yetinilir).

## Risk / Notlar

- Dark border açıldığında bazı UI bileşenlerinde (input, separator) kontur yer yer "kalın" hissi verebilir; hızlı bir görsel tarama sonrası `--input` farklı tutulabilir.
- Noise overlay performans için saf inline SVG/CSS, ekstra asset yok.

## Değişecek dosyalar

- `src/index.css` (token + utility ekleri)
- `src/components/landing/Hero.tsx`
- `src/components/landing/ProjectSignalCard.tsx`
- `src/components/landing/ModelSection.tsx`
- `src/components/landing/StageMapSection.tsx`
- `src/components/landing/AudienceSection.tsx`
- `src/components/landing/TwelveWeekFlowSection.tsx`
- `src/components/landing/FinalCtaSection.tsx`
- `src/components/landing/Footer.tsx`

## Onay sonrası doğrulama

1. Light + dark temada her iki dilde (tr/en) görsel kontrol.
2. Dark'ta tüm landing kartlarının kenarı net görünür.
3. Build temiz çalışıyor.
