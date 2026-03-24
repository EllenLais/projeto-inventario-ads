import { Navigate } from 'react-router-dom';
import LoadingScreen from '@/components/LoadingScreen';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { loading, user } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

