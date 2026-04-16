import { useQuery } from '@tanstack/react-query';
import { fetchOrderStats } from '../api/ordersApi';

export function useOrderStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['orders', 'stats'],
    queryFn: fetchOrderStats,
  });
  return { stats, isLoading };
}
