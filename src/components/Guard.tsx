import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface GuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function Guard({ children, requireAuth = true }: GuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Yükleniyor...</p>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
