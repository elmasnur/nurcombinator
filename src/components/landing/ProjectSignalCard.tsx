import { useTranslation } from 'react-i18next';
import { Activity, AlertTriangle, Compass, Sparkles, Users, Megaphone } from 'lucide-react';

function Row({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-ivory/70 p-3 backdrop-blur">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accent}`}>{icon}</div>
      <div className="min-w-0">
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-0.5 truncate text-sm font-semibold text-slate-deep">{value}</div>
      </div>
    </div>
  );
}

function ProgressRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium text-slate-deep">{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/60">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Metric({ value, label, accent }: { value: string; label: string; accent: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-ivory/70 p-3 backdrop-blur">
      <div className={`font-display text-2xl font-bold ${accent}`}>{value}</div>
      <div className="mt-1 text-[11px] leading-tight text-muted-foreground">{label}</div>
    </div>
  );
}

export default function ProjectSignalCard() {
  const { t } = useTranslation();
  return (
    <div className="relative animate-fade-in">
      <div aria-hidden className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-accent-amber/20 via-accent-sky/10 to-accent-violet/20 blur-2xl" />
      <div className="glass-card relative rounded-3xl p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-deep text-ivory">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="font-display text-base font-bold text-slate-deep">{t('landing.signal.title')}</div>
              <div className="text-[11px] text-muted-foreground">{t('landing.signal.subtitle')}</div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-amber-soft px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-amber-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-amber" />
            {t('landing.signal.placeholder')}
          </span>
        </div>

        <div className="space-y-2.5">
          <Row icon={<Compass className="h-4 w-4 text-accent-sky-foreground" />} label={t('landing.signal.stageLabel')} value={t('landing.signal.stageValue')} accent="bg-accent-sky" />
          <Row icon={<Sparkles className="h-4 w-4 text-accent-amber-foreground" />} label={t('landing.signal.needLabel')} value={t('landing.signal.needValue')} accent="bg-accent-amber" />
          <Row icon={<Megaphone className="h-4 w-4 text-accent-violet-foreground" />} label={t('landing.signal.openingLabel')} value={t('landing.signal.openingValue')} accent="bg-accent-violet" />
          <Row icon={<AlertTriangle className="h-4 w-4 text-warning-foreground" />} label={t('landing.signal.riskLabel')} value={t('landing.signal.riskValue')} accent="bg-warning" />
        </div>

        <div className="mt-5 space-y-3">
          <ProgressRow label={t('landing.signal.stageProgress')} value={62} color="bg-gradient-to-r from-accent-amber to-accent-amber/70" />
          <ProgressRow label={t('landing.signal.trustProgress')} value={78} color="bg-gradient-to-r from-accent-sky to-accent-violet" />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <Metric value="24" label={t('landing.signal.metricMentors')} accent="text-accent-violet" />
          <Metric value="61" label={t('landing.signal.metricNeeds')} accent="text-accent-amber" />
        </div>
      </div>
    </div>
  );
}