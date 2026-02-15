import { Badge } from '@/components/ui/badge';
import { STAGE_LABELS, STAGE_ORDER, StageKey } from '@/lib/types';

interface StageBadgeProps {
  stage: StageKey;
  size?: 'sm' | 'md';
}

export default function StageBadge({ stage, size = 'sm' }: StageBadgeProps) {
  const idx = STAGE_ORDER.indexOf(stage);
  return (
    <Badge variant="outline" className={`border-gold-subtle text-accent-foreground ${size === 'md' ? 'px-3 py-1' : ''}`}>
      <span className="mr-1.5 text-primary">{idx + 1}.</span>
      {STAGE_LABELS[stage]}
    </Badge>
  );
}
