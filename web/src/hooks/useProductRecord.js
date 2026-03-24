import { useEffect, useState } from 'react';
import { getErrorMessage } from '@/lib/firebaseErrors';
import { subscribeToMovementsByProduct, subscribeToProduct } from '@/services/productService';

export function useProductRecord(userId, productId) {
  const [product, setProduct] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId || !productId) {
      setProduct(null);
      setMovements([]);
      setLoading(false);
      setError('');
      return undefined;
    }

    setLoading(true);
    setError('');

    const unsubscribeProduct = subscribeToProduct(
      productId,
      (nextProduct) => {
        if (!nextProduct || nextProduct.userId !== userId || nextProduct.deleted) {
          setProduct(null);
          setLoading(false);
          return;
        }

        setProduct(nextProduct);
        setLoading(false);
      },
      (subscriptionError) => {
        setError(getErrorMessage(subscriptionError));
        setLoading(false);
      },
    );

    const unsubscribeMovements = subscribeToMovementsByProduct(
      userId,
      productId,
      (nextMovements) => {
        setMovements(nextMovements);
      },
      (subscriptionError) => {
        setError(getErrorMessage(subscriptionError));
      },
    );

    return () => {
      unsubscribeProduct();
      unsubscribeMovements();
    };
  }, [productId, userId]);

  return { product, movements, loading, error };
}
