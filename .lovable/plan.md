
# Landing Refinement — Reference Görsele Hizalama

Mevcut redesign çatısı doğru kuruldu (token, i18n, bölümler). Ancak yüklenen referans görsel daha zengin: chip badge'ler, feature pill kartları, renkli stage kartları, oklu audience grid, yatay 8 adımlı flow ve mandala-glow'lu koyu Final CTA. Bu plan eksiksiz görsel paritesi için odaklı düzeltmeleri kapsar.

## Kapsam

Sadece landing yüzeyi. Auth, route, Navbar (global), backend, db değişmez.

## Değişecek / eklenecek dosyalar

**Düzenle:**
- `src/index.css` — yeni utility'ler: `.bg-mesh-radial` (mandala glow), `.shadow-elevated`, küçük token rötuşu (gerekirse).
- `src/components/landing/Hero.tsx` — chip badge sırası, primary CTA amber'a çevrilecek, headline'da son kelime (`istikamet.`) italic+amber span; hero altına 3 feature pill kartı + 2 metric kart şeridi taşınacak (Project Signal kartı yalnızca metrikleri kendi içinde tutacak; geniş metrik blokları hero alt grid'ine alınacak).
- `src/components/landing/ProjectSignalCard.tsx` — üst kısımda evre dot-progress bar (6 nokta), 4 satır + sağda yüzde mini-progress; mandala-stil sade.
- `src/components/landing/ModelSection.tsx` — kart layout'u: solda yuvarlak renkli icon badge, sağda title+desc, ince border. Renkler: amber, sky, violet, warm-orange.
- `src/components/landing/StageMapSection.tsx` — 6 renkli kart (her kart farklı pastel zemin: amber/sky/violet/emerald/orange/sky), üstte numara rozeti, ortada başlık+kısa metin, altta büyük tek icon. Mobilde tek kolon, lg'de 6 kolon.
- `src/components/landing/AudienceSection.tsx` — **4 karta indir** (kullanıcı yeni listeyi verdi), 2 kolonlu grid; her kartta sol icon, başlık+desc, sağda chevron oku. Kısa intro: "İyiliği artıran, ilme ve topluma fayda sunan projeler için tasarlandı."
- `src/components/landing/TwelveWeekFlowSection.tsx` — 8 kart yatay grid (lg:grid-cols-8, md:grid-cols-4, sm:grid-cols-2). Her kart: numara üstte, başlık ortada, ikon altta; pastel zemin; aralarda küçük chevron sağ ok (lg ve üzeri).
- `src/components/landing/FinalCtaSection.tsx` — koyu slate-deep zemin, ortada mandala radial glow, sol blokta headline + 6 maddeli check listesi (3'lü 2 grid), sağda amber CTA + alt sekonder login linki. Köşelerde subtle amber/sky/violet glow.
- `src/components/landing/Footer.tsx` — 3 sütun: sol kalp+tagline, orta globe+domain, sağ küçük amber simge+motto.
- `src/components/landing/SectionHeading.tsx` — eyebrow opsiyonel kalsın, başlıkta italic accent kelime span desteği için `accentWord` prop eklenebilir (opsiyonel).
- `src/i18n/locales/{tr,en}.json` — `landing.hero.chips.*`, `landing.hero.pills.*`, `landing.audience.intro`, `landing.audience.a1..a4` (yeni 4 maddeye revize), `landing.finalCta.checks.*` (6 madde) anahtarları.

**Yeni:**
- `src/components/landing/HeroPills.tsx` — Hero altındaki "12 haftalık akış / İhtiyaç eşleşmesi / Impact Day" pill kartları + 2 büyük metric kart bandı.
- `src/components/landing/FlowConnector.tsx` (opsiyonel, küçük chevron SVG bridging arası).

## Tasarım kuralları

- Tema: light (ivory) varsayılan; sadece Final CTA bloğu koyu slate-deep.
- Renk semantik token: `accent-amber` (primary CTA), `accent-sky`, `accent-violet`, ek pastel softlar (`-soft` varyantları zaten var).
- Tipografi: Playfair Display başlık (mevcut), gövde Open Sans.
- Motion: `animate-fade-in` (zaten var) + Tailwind `transition` hover-lift; framer-motion **eklenmeyecek**.
- Mobil: tüm grid'ler 1 kolon stack; flow yatayda mobil için snap-scroll yerine wrap (md:2 lg:8); audience 1 kolon (md:2).
- Erişilebilirlik: `<header>/<section>/<footer>` semantik (zaten kullanılıyor), `aria-label` butonlarda, focus ring shadcn varsayılanı.

## Dokunulmayacak

- `src/components/Navbar.tsx`, `App.tsx` route'ları, auth, supabase, edge functions, migrations, diğer sayfalar.
- Eski landing key'leri (`landing.howItWorks` vb.) silinmeyecek.
- Karanlık varsayılan tema **kurulmayacak**; mevcut tema toggle korunacak.

## Riskler

- i18n: 4 → eski 6 audience mapping (kullanılmayan a5/a6 anahtarları korunup landing'de gösterilmeyecek — geriye dönük uyum).
- Yatay 8'li flow lg ekran altında sıkışabilir → md:grid-cols-4 + sm:grid-cols-2 fallback ile çözülür; chevron'lar sadece lg+ görünür.
- Mandala glow yalnızca CSS radial gradient ile yapılacak (resim asset eklenmeyecek).

## Checklist (bu görevde karşılanacaklar)

- [x] Header: mevcut Navbar korunur (kapsam dışı, kullanıcı kuralı)
- [x] Hero: chip + headline + amber CTA + secondary
- [x] Project Signal kart (dot stage + satır yüzdeleri)
- [x] Model section (4 kart)
- [x] Stage map (6 renkli kart + icon)
- [x] Audience (4 kart, oklu)
- [x] 12 haftalık akış (8 kart yatay)
- [x] Final CTA (koyu slate, mandala glow, 6 check)
- [x] Footer (3 sütun)
- [x] Responsive (sm/md/lg breakpoint testi)
- [x] Auth/backend/db dokunulmadı
- [x] Karanlık varsayılan yok
- [x] Sahte logo/testimonial/pricing yok

## Build doğrulaması

Uygulama tamamlandıktan sonra harness otomatik build çalıştırır; hata olursa düzeltilir.
