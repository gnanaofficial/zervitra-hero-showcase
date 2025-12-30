import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ManagerRouteProps {
  children: React.ReactNode;
}

const ManagerRoute = ({ children }: ManagerRouteProps) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'manager') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ManagerRoute;
