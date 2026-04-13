import { useAuth } from '@/hooks/useAuth';
import { Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface GuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function Guard({ children, requireAuth = true }: GuardProps) {
  const { user, loading } = useAuth();
  const { lang } = useParams<{ lang: string }>();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to={`/${lang ?? 'tr'}/auth`} replace />;
  }

  return <>{children}</>;
}
