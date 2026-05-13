import { useTranslation } from 'react-i18next';
import { Activity, Rocket, Users, TrendingUp, ShieldCheck } from 'lucide-react';

function StageDots({ active = 2, total = 6 }: { active?: number; total?: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-[10px] font-mono tracking-wider text-muted-foreground/70">
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className={i === active ? 'text-accent-violet font-semibold' : ''}>
            {String(i + 1).padStart(2, '0')}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => {
          const reached = i <= active;
          return (
            <div key={i} className="flex flex-1 items-center gap-1.5">
              <span
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === active
                    ? 'bg-accent-violet ring-4 ring-accent-violet/20'
                    : reached
                    ? 'bg-accent-violet'
                    : 'bg-border'
                }`}
              />
              {i < total - 1 && (
                <span className={`h-0.5 flex-1 rounded-full ${i < active ? 'bg-accent-violet' : 'bg-border'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SignalRow({
  icon,
  label,
  value,
  percent,
  tone,
  bar,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  percent: number;
  tone: string;
  bar: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-ivory/70 p-3.5 transition hover:bg-ivory">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
            <div className="truncate text-[13px] font-semibold leading-snug text-slate-deep">{value}</div>
          </div>
          <div className="font-mono text-sm font-semibold text-slate-deep">{percent}%</div>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border/50">
          <div className={`h-full rounded-full ${bar}`} style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
}

export default function ProjectSignalCard() {
  const { t } = useTranslation();
  return (
    <div className="relative animate-fade-in">
      <div aria-hidden className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-accent-amber/15 via-accent-sky/10 to-accent-violet/15 blur-2xl" />
      <div className="glass-card shadow-soft-3 relative rounded-[28px] p-5 md:p-6">
        {/* faint inner grid */}
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[28px] bg-grid-soft opacity-[0.04]" />

        <div className="relative mb-5 flex items-center justify-between">
          <div className="font-display text-base font-bold tracking-tight text-slate-deep">{t('landing.signal.title')}</div>
          <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-ivory/70 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-sky opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-sky" />
            </span>
            <Activity className="h-3 w-3 text-accent-sky" />
            live
          </div>
        </div>

        <div className="relative mb-4 rounded-2xl border border-border/50 bg-ivory/70 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent-violet-soft">
                <Rocket className="h-3.5 w-3.5 text-accent-violet" />
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {t('landing.signal.stageLabel')}
              </span>
            </div>
            <span className="text-sm font-semibold text-slate-deep">{t('landing.signal.stageValue')}</span>
          </div>
          <StageDots active={2} total={6} />
        </div>

        <div className="relative space-y-2.5">
          <SignalRow
            icon={<Users className="h-4 w-4 text-accent-sky-foreground" />}
            label={t('landing.signal.needLabel')}
            value={t('landing.signal.needValue')}
            percent={82}
            tone="bg-accent-sky-soft"
            bar="bg-gradient-to-r from-accent-sky to-accent-sky/70"
          />
          <SignalRow
            icon={<TrendingUp className="h-4 w-4 text-success-foreground" />}
            label={t('landing.signal.openingLabel')}
            value={t('landing.signal.openingValue')}
            percent={68}
            tone="bg-success/15"
            bar="bg-gradient-to-r from-success to-success/70"
          />
          <SignalRow
            icon={<ShieldCheck className="h-4 w-4 text-accent-amber-foreground" />}
            label={t('landing.signal.riskLabel')}
            value={t('landing.signal.riskValue')}
            percent={55}
            tone="bg-accent-amber-soft"
            bar="bg-gradient-to-r from-accent-amber to-accent-amber/70"
          />
        </div>
      </div>
    </div>
  );
}
