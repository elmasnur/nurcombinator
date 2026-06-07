## Amaç
Kullanıcının yüklediği yeni optimize edilmiş 3 görseli mevcut CDN pointer dosyalarının yerine koymak. `BrandLogo` componenti zaten bu pointer JSON'larından okuduğu için kod değişikliği gerekmiyor — sadece asset'ler güncellenecek.

## Adımlar

1. **Görselleri kırp**
   - `/mnt/user-uploads/Nur-combinator-logo.png`, `Nur-combinator-icon-color.png`, `Nur-combinator-icon-black.png` dosyalarını ImageMagick `-trim +repage` ile kırp (kenarlardaki şeffaf boşluğu temizle, küçük bir padding bırak).

2. **CDN'e yeniden yükle**
   - Eski pointer'ları (`src/assets/nur-combinator-logo.png.asset.json`, `nur-combinator-icon.png.asset.json`, `nur-combinator-icon-black.png.asset.json`) sil → `assets--delete_asset`.
   - Kırpılmış dosyaları `lovable-assets create --filename ...` ile yükle, çıktıyı aynı pointer dosyalarına yaz. Yeni `asset_id` ve URL otomatik gelir.

3. **Doğrulama**
   - Navbar ve Footer'ın `BrandLogo` üzerinden yeni asset URL'lerini render ettiğini build/preview'da doğrula.

## Dokunulmayacak
- `BrandLogo.tsx`, `Navbar.tsx`, `Footer.tsx` — kod yok.
- Auth, DB, RLS, route, SEO, favicon, OG — değişmiyor.

## Risk
- Yeni asset'ler yüklenince eski CDN URL'leri silinir; önceki preview/deploy'lar logoyu kaybeder (geri alınabilir: kullanıcı bu commit'i revert edebilir).
