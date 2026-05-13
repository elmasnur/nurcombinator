import { ReactNode } from 'react';

interface Props {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', className = '' }: Props) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={`max-w-3xl ${alignClass} ${className}`}>
      {eyebrow && (
        <div className={`mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-amber ${align === 'center' ? '' : ''}`}>
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-3xl font-bold leading-tight text-slate-deep md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base text-muted-foreground md:text-lg">{subtitle}</p>
      )}
    </div>
  );
}