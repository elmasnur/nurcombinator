import { ReactNode } from 'react';

interface Props {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', className = '' }: Props) {
  const alignClass = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';
  return (
    <div className={`flex max-w-3xl flex-col ${alignClass} ${className}`}>
      {eyebrow && (
        <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-amber">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-amber" />
          <span className="h-px w-6 bg-accent-amber/40" />
          {eyebrow}
        </div>
      )}
      <h2 className="text-balance font-display text-[2rem] font-bold leading-[1.08] tracking-[-0.01em] text-slate-deep md:text-[2.5rem] lg:text-[3rem]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-pretty text-[15px] leading-[1.65] text-muted-foreground md:text-base">{subtitle}</p>
      )}
    </div>
  );
}
