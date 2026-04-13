import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export default function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertTriangle className="mb-4 h-10 w-10 text-destructive" />
      <h3 className="mb-1 font-display text-lg font-semibold text-foreground">{title ?? t('common.errorTitle')}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{description ?? t('common.errorDesc')}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="border-border">
          {t('common.retry')}
        </Button>
      )}
    </div>
  );
}
