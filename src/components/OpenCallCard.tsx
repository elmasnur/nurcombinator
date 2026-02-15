import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { CALL_TYPE_LABELS, LOCATION_MODE_LABELS, OpenCall } from '@/lib/types';
import { MapPin, Clock } from 'lucide-react';
import { formatDate } from '@/lib/helpers';

interface Props {
  call: OpenCall & { projects?: { title: string; slug: string | null } | null };
}

export default function OpenCallCard({ call }: Props) {
  return (
    <Link to={`/open-calls/${call.id}`}>
      <Card className="group border-border bg-card transition hover:border-primary/30 hover:glow-gold">
        <CardContent className="p-5">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-gradient-gold">
              {call.title}
            </h3>
            <span className={`shrink-0 rounded px-2 py-0.5 text-xs ${call.status === 'open' ? 'bg-success/20 text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
              {call.status === 'open' ? 'Açık' : call.status === 'paused' ? 'Duraklatıldı' : 'Kapalı'}
            </span>
          </div>
          {call.projects && (
            <p className="mb-2 text-xs text-muted-foreground">
              Proje: <span className="text-foreground">{call.projects.title}</span>
            </p>
          )}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {LOCATION_MODE_LABELS[call.location_mode]}
            </span>
            <span>{CALL_TYPE_LABELS[call.call_type]}</span>
            {call.apply_until && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Son: {formatDate(call.apply_until)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
