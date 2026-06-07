import logoAsset from '@/assets/nur-combinator-logo.png.asset.json';
import iconColorAsset from '@/assets/nur-combinator-icon.png.asset.json';
import iconBlackAsset from '@/assets/nur-combinator-icon-black.png.asset.json';

type Variant = 'icon' | 'full';

interface BrandLogoProps {
  variant?: Variant;
  className?: string;
  alt?: string;
}

/**
 * Açık temada renkli varyantı, koyu temada siyah varyantı beyaza
 * çevrilmiş şekilde gösterir. İki <img> tek seferde indirilir, tema
 * geçişinde flicker olmaz.
 */
export default function BrandLogo({ variant = 'full', className = '', alt = 'Nur Combinator' }: BrandLogoProps) {
  const lightSrc = variant === 'icon' ? iconColorAsset.url : logoAsset.url;
  const darkSrc = variant === 'icon' ? iconBlackAsset.url : logoAsset.url;
  // brightness(0) -> tamamen siyah, invert(1) -> beyaz. Siyah ikon/logo için temiz monokrom verir.
  const darkFilter = 'brightness(0) invert(1)';

  return (
    <span className={`inline-flex items-center ${className}`}>
      <img
        src={lightSrc}
        alt={alt}
        className="block h-full w-auto dark:hidden"
        loading="eager"
        decoding="async"
        draggable={false}
      />
      <img
        src={darkSrc}
        alt=""
        aria-hidden="true"
        className="hidden h-full w-auto dark:block"
        style={{ filter: darkFilter }}
        loading="eager"
        decoding="async"
        draggable={false}
      />
    </span>
  );
}
