import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'seller' | 'buyer';
}

export const ProtectedRoute = ({ children, requiredRole = 'buyer' }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [roleError, setRoleError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchUserRole = async () => {
      if (!user) {
        if (!cancelled) {
          setUserRole(null);
          setRoleLoading(false);
        }
        return;
      }

      setRoleLoading(true);
      setRoleError(null);

      // Use maybeSingle so a missing row is not treated as an error.
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error('ProtectedRoute: failed to fetch user role', error);
        setRoleError(error.message);
        setUserRole(null);
      } else {
        setUserRole(data?.role ?? 'buyer');
      }
      setRoleLoading(false);
    };

    fetchUserRole();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading || roleLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If we couldn't read the role at all, surface the error rather than silently
  // redirecting (which previously made admins look "kicked out" of the panel).
  if (roleError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-xl font-semibold mb-2">Could not verify your access</h1>
        <p className="text-muted-foreground max-w-md">
          We couldn't load your account permissions. Please refresh the page or sign out and back in.
        </p>
        <p className="text-xs text-muted-foreground mt-4">{roleError}</p>
      </div>
    );
  }

  if (requiredRole === 'admin' && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'seller' && !['admin', 'seller'].includes(userRole || '')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
