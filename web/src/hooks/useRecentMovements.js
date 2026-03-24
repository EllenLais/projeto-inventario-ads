import { useEffect, useState } from 'react';
import { getErrorMessage } from '@/lib/firebaseErrors';
import { subscribeToRecentMovements } from '@/services/productService';

export function useRecentMovements(userId, limitCount = 6) {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setMovements([]);
      setLoading(false);
      setError('');
      return undefined;
    }

    setLoading(true);
    setError('');

    const unsubscribe = subscribeToRecentMovements(
      userId,
      (nextMovements) => {
        setMovements(nextMovements);
        setLoading(false);
      },
      (subscriptionError) => {
        setError(getErrorMessage(subscriptionError));
        setLoading(false);
      },
      limitCount,
    );

    return unsubscribe;
  }, [limitCount, userId]);

  return { movements, loading, error };
}

