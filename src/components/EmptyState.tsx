import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: React.ReactNode;
  message: string;
  actionLabel?: string;
  actionTo?: string;
}

export default function EmptyState({ icon, message, actionLabel, actionTo }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon ?? <Inbox className="mb-3 h-10 w-10 text-muted-foreground/50" />}
      <p className="mb-4 text-sm text-muted-foreground">{message}</p>
      {actionLabel && actionTo && (
        <Button asChild variant="outline" size="sm" className="border-border">
          <Link to={actionTo}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
