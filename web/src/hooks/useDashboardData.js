import { useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useRecentMovements } from '@/hooks/useRecentMovements';

export function useDashboardData(userId) {
  const productsState = useProducts(userId);
  const movementsState = useRecentMovements(userId);

  const metrics = useMemo(() => {
    const productsById = new Map(productsState.products.map((product) => [product.id, product]));
    const lowStockProducts = productsState.products.filter((product) => product.quantity < 5);
    const totalStockItems = productsState.products.reduce(
      (sum, product) => sum + Number(product.quantity || 0),
      0,
    );
    const recentMovements = movementsState.movements.map((movement) => ({
      ...movement,
      productName: productsById.get(movement.productId)?.name || movement.productId,
    }));

    return {
      totalProducts: productsState.products.length,
      totalStockItems,
      lowStockProducts,
      recentMovements,
    };
  }, [movementsState.movements, productsState.products]);

  return {
    ...metrics,
    loading: productsState.loading || movementsState.loading,
    error: productsState.error || movementsState.error,
  };
}
