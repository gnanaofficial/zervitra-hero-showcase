import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ClientRouteProps {
  children: React.ReactNode;
}

const ClientRoute = ({ children }: ClientRouteProps) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'user') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ClientRoute;
