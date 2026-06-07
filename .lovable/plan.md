## Amaç
Yüklenen Nur Combinator logo ve ikonlarını siteye entegre etmek; etraftaki boş alanı kırpmak; açık temada renkli ikonu, koyu temada beyaza dönüştürülmüş varyantı göstermek.

## Adımlar

1. **Görselleri kırp ve CDN'e yükle**
   - `/mnt/user-uploads/nur-combinator-logo.png`, `nur-combinator-icon.png`, `nur-combinator-icon-black.png` dosyalarını ImageMagick (`-trim +repage`) ile kırp, küçük bir transparan padding bırak.
   - `lovable-assets create` ile üçünü de CDN'e yükle, pointer JSON'larını `src/assets/` altına yaz:
     - `nur-combinator-logo.png.asset.json` (yatay tam logo, açık tema)
     - `nur-combinator-icon.png.asset.json` (renkli ikon, açık tema)
     - `nur-combinator-icon-black.png.asset.json` (siyah ikon → koyu temada beyaza filtrelenecek)

2. **Reusable `BrandLogo` componenti** (`src/components/BrandLogo.tsx`)
   - Prop: `variant: 'icon' | 'full'`, `className`.
   - Açık tema: renkli icon ya da renkli yatay logo (olduğu gibi).
   - Koyu tema: siyah icon / siyah-metinli logo varyantını CSS `filter: brightness(0) invert(1)` ile beyaza çevir.
   - İki `<img>` üst üste, `dark:hidden` ve `hidden dark:block` ile geçiş — flicker yok. `alt="Nur Combinator"`, `loading="eager"` navbar için.

3. **Navbar entegrasyonu** (`src/components/Navbar.tsx`)
   - Mevcut text wordmark'ın yerine: mobilde sadece `icon`, `sm` ve üstünde `full` logo. Yükseklik ~28-32px, navbar h-14 ile uyumlu.

4. **Footer entegrasyonu** (`src/components/landing/Footer.tsx`)
   - Sol bloğa küçük ikon + "Nur Combinator" metni yerine yatay logo (yükseklik ~20px). Mevcut microcopy korunur.

5. **Favicon / OG**
   - `public/favicon.ico` zaten var — dokunmuyoruz (kullanıcı istemedi). Sadece site içi kullanım.

## Dokunulmayacak
- Auth, DB, RLS, route yapısı, SEO meta — değişmiyor.
- `index.html` favicon/OG referansları aynı kalıyor.

## Riskler
- Koyu temada renkli ikon yerine beyaz monokrom göstermek, marka renginden (amber) feragat etmek demek; istek bu yönde olduğu için uygulanacak. İleride istenirse koyu tema için ayrı renkli varyant üretilebilir.