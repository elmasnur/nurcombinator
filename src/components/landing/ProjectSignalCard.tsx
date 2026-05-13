import { useTranslation } from 'react-i18next';
import { Activity, Rocket, Users, TrendingUp, ShieldCheck } from 'lucide-react';

function StageDots({ active = 3, total = 6 }: { active?: number; total?: number }) {
  return (
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
    <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-ivory/60 p-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="truncate text-sm font-semibold text-slate-deep">{value}</div>
          </div>
          <div className="font-mono text-xs font-semibold text-slate-deep">{percent}%</div>
        </div>
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-border/60">
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
      <div aria-hidden className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-accent-amber/20 via-accent-sky/10 to-accent-violet/20 blur-2xl" />
      <div className="glass-card relative rounded-3xl p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="font-display text-base font-bold text-slate-deep">{t('landing.signal.title')}</div>
          <Activity className="h-4 w-4 text-accent-sky" />
        </div>

        <div className="mb-4 rounded-xl border border-border/50 bg-ivory/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4 text-accent-violet" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {t('landing.signal.stageLabel')}
              </span>
            </div>
            <span className="text-sm font-semibold text-slate-deep">{t('landing.signal.stageValue')}</span>
          </div>
          <StageDots active={2} total={6} />
        </div>

        <div className="space-y-2.5">
          <SignalRow
            icon={<Users className="h-4 w-4 text-accent-sky-foreground" />}
            label={t('landing.signal.needLabel')}
            value={t('landing.signal.needValue')}
            percent={82}
            tone="bg-accent-sky-soft"
            bar="bg-accent-sky"
          />
          <SignalRow
            icon={<TrendingUp className="h-4 w-4 text-success-foreground" />}
            label={t('landing.signal.openingLabel')}
            value={t('landing.signal.openingValue')}
            percent={68}
            tone="bg-success/15"
            bar="bg-success"
          />
          <SignalRow
            icon={<ShieldCheck className="h-4 w-4 text-accent-amber-foreground" />}
            label={t('landing.signal.riskLabel')}
            value={t('landing.signal.riskValue')}
            percent={55}
            tone="bg-accent-amber-soft"
            bar="bg-accent-amber"
          />
        </div>
      </div>
    </div>
  );
}
