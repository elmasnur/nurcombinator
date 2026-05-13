
# Premium Polish Pass — Landing Page

Yapı, kopya ve route'lara dokunmadan; ritim, tipografi, gölge, gradient ve mobil sıkışıklığını gidererek landing'i "designer-made" hissine taşıyacak hassas bir cila geçişi.

## Kapsam

Sadece görsel cila. Yeni bölüm yok, kopya değişmez, auth/backend/db/route dokunulmaz.

## Değişecek dosyalar

- `src/index.css`
  - Yeni utility'ler: `.bg-grain` (çok hafif noise), `.bg-grid-soft` (10% opacity grid texture), `.divider-fade` (section-to-section ivory→ivory-deep yumuşak geçiş), `.btn-focus-ring` (tutarlı focus halkası), `.shadow-soft-1/2/3` token'lı gölge merdiveni.
  - `glass-card` rötuşu: çift katmanlı gölge + ince inner-highlight refinement.
  - Body type rendering: `text-rendering: optimizeLegibility` + `font-feature-settings: "ss01","cv11"`.

- `src/pages/Landing.tsx`
  - Bölümler arası `<div className="divider-fade" aria-hidden />` SVG/gradient ayraç ile yumuşak geçiş; fazladan `py` çakışmasını engellemek için section padding'leri normalize.

- `src/components/landing/SectionHeading.tsx`
  - Eyebrow'a küçük amber nokta + ince çizgi ön-eki (system look).
  - Title leading sıkılaştır (`leading-[1.08]`), tracking `-tracking-[0.01em]`, mobilde `text-[2rem]` taban.
  - Subtitle max-width düşür (`max-w-2xl`) + `text-pretty`.

- `src/components/landing/Hero.tsx`
  - 12-kolon grid'i 7/5'e dengele, dikey alignment iyileştir; sol blokta üst boşluk + alt CTA arası ritim.
  - Headline tipografisi: `text-[2.5rem] sm:text-5xl lg:text-[4.5rem] xl:text-[5rem] leading-[1.02] -tracking-[0.02em]`. Son kelime italic+amber `font-display` korunur, ince underline-glow eklenir.
  - Chip'ler: yüksekliği 28px sabitle, ince ring + subtle inner shadow.
  - Primary CTA: amber gradient (`from-accent-amber to-accent-amber/85`) + odak halkası; secondary: glass border + hover translate.
  - Hero pill+metric şeridi mobilde 1 kolon, sm:2, lg:5 (zaten var) ama kart iç padding'lerini `p-5` çık, ikon/metin hizası grid `items-center`.
  - Arka plan blob'larını biraz kıs ve `mix-blend-multiply` ile daha "kâğıt" his ver.

- `src/components/landing/ProjectSignalCard.tsx`
  - Üst başlık şeridi: sola küçük rocket+stage etiketi rozet, sağa "live" pulse + Activity ikon (status bar gibi).
  - Stage dot bar'a hafif "milestone" label'ları (1..6 rakam tooltipsiz, küçük üst etiket).
  - 3 satır kart'ları daha sıkı: solda renkli ikon kutusu (10x10), ortada label/value, sağda büyük yüzde + ince % bar.
  - Kartın içine ince üst grid texture overlay (opacity 0.04) + 1px inner highlight; dış gradient halo'yu sönükleştir.
  - Köşelere `rounded-[28px]` + `shadow-soft-3`.

- `src/components/landing/ModelSection.tsx`
  - Kartlar arası gap `gap-6`, kart `p-7 rounded-2xl`, üst icon kutusunu daire (`rounded-full`) yap (referansla uyumlu).
  - Hover: `-translate-y-1` + amber border glow ring; aktif baseline border `border-border/60`.

- `src/components/landing/StageMapSection.tsx`
  - Tüm kartlar aynı yükseklik (`h-full grid grid-rows-[auto_auto_1fr_auto]`).
  - Numara rozeti dışa çıkık (top-left `-mt-3`).
  - Kart aralarına bağlayıcı ince çizgi (lg only, dashed border-dashed).
  - Tutarlı opacity tonları (60%) + tek bir `rounded-2xl` shape.

- `src/components/landing/AudienceSection.tsx`
  - 4-kart layout 12-kolon split korunur; başlık tarafına küçük amber dash-divider eklenir (referansta var).
  - Kart hover: chevron amber'a kayar (zaten var) + ince border ring genişler.
  - Mobilde sol başlık üstte stack.

- `src/components/landing/TwelveWeekFlowSection.tsx`
  - Kartlara min-h ekle (`min-h-[10.5rem]`) ki başlıklar 1/2/3 satırda hizalansın.
  - Numara tipografisi `font-mono text-xs tracking-[0.18em]`, ikon altında ince ayraç çizgisi.
  - lg-altı (md): 4 kolon ama chevron'lar gizli; sm: 2 kolon; xs: yatay snap-scroll (`snap-x` overflow) tek satır okunabilirliği için.
  - Bağlantı chevron'ları lg+ daha hafif (`text-border/60`).

- `src/components/landing/FinalCtaSection.tsx`
  - Slate kart `rounded-[2rem]` + `border-slate-deep/30`, padding `p-10 md:p-14 lg:p-16`.
  - Mandala dot pattern opacity'sini düşür (0.05) + sol kenarda subtle SVG mandala silüeti (statik, dekoratif, ince çizgi, %10 opacity, asset değil inline SVG).
  - CTA buton sol-sağ dengeli; checklist 2 sütun mobilde tek sütun.
  - Login linki ayrı satıra alınır, ikon hizası tutarlı.

- `src/components/landing/Footer.tsx`
  - Üstte `divider-fade` ile yumuşak geçiş; padding `py-10`, fontlar daha ince, ortadaki domain'e küçük gold underline-glow.

## Tipografi & ritim kuralları

- Section vertical rhythm: `py-20 md:py-24 lg:py-28` standardı; ardışık iki ivory-deep yan yana gelmesin (Audience deep → Flow ivory → CTA ivory-deep zaten doğru).
- Heading scale: H1 `text-[2.5rem]→5rem`, H2 `text-[1.875rem]→3rem`, eyebrow `text-[11px]`.
- Body `text-[15px] leading-[1.65]` muted.
- Tüm CTA: `h-11 px-6 rounded-xl font-medium` + `focus-visible:ring-2 ring-accent-amber/60 ring-offset-2 ring-offset-ivory`.

## Mobil iyileştirmeleri

- Hero: tek kolon stack, headline `text-4xl`, Project Signal kart hero altına; pill şeridi `grid-cols-1 sm:grid-cols-2`.
- Stage map: `sm:grid-cols-2 lg:grid-cols-6` (zaten var) + her kart yüksekliği eşit.
- 12-week: `xs:flex snap-x` opsiyon (tek satır kaydırılır), default `sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8`.
- Final CTA mobil: padding `p-6`, başlık 24px, checklist tek sütun.
- Footer: 3 sütun → mobilde stack center.

## Dokunulmayacak

- Routes, App.tsx, Navbar (global), auth, Supabase client, edge functions, migrations.
- i18n key'leri (yalnız stil/sınıf düzenlemesi).
- Mevcut tema toggle ve dark variant (varsayılan light kalır).
- Hiçbir asset import edilmeyecek (mandala dekorları inline SVG).

## Riskler

- `min-h` zorlamaları çok uzun çevirilerde kart taşması yapabilir → `line-clamp` yerine doğal akış bırakılır.
- `mix-blend-multiply` Safari'de hafif farklı render → opacity fallback ile yumuşatılır.
- Yeni utility'ler (`bg-grid-soft`, `divider-fade`) sadece landing'de kullanılıyor; global scope etkilemez.

## Doğrulama

Otomatik harness build sonrası, hata varsa düzeltilir. Görsel inceleme için preview screenshot alınabilir (gerekirse).

## Checklist

- [x] Spacing ritmi normalize
- [x] Tipografi hiyerarşisi sıkılaştırıldı
- [x] Hero headline daha güçlü
- [x] Project Signal product-like
- [x] Premium kart gölge/border/hover
- [x] Bölüm geçişleri yumuşak
- [x] Final CTA otoriter, gaudy değil
- [x] Mobil sıkışıklık giderildi
- [x] CTA tutarlı + focus ring
- [x] Yapı/kopya değişmedi
- [x] Auth/backend/db değişmedi
