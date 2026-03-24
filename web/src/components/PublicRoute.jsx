import { Navigate } from 'react-router-dom';
import LoadingScreen from '@/components/LoadingScreen';
import { useAuth } from '@/hooks/useAuth';

export default function PublicRoute({ children }) {
  const { loading, user } = useAuth();

  if (loading) {
    return <LoadingScreen label="Checking your session..." />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

