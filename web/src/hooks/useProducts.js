import { useEffect, useState } from 'react';
import { getErrorMessage } from '@/lib/firebaseErrors';
import { subscribeToProducts } from '@/services/productService';

export function useProducts(userId) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setProducts([]);
      setLoading(false);
      setError('');
      return undefined;
    }

    setLoading(true);
    setError('');

    const unsubscribe = subscribeToProducts(
      userId,
      (nextProducts) => {
        setProducts(nextProducts);
        setLoading(false);
      },
      (subscriptionError) => {
        setError(getErrorMessage(subscriptionError));
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [userId]);

  return { products, loading, error };
}

