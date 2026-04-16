import { useQuery } from '@tanstack/react-query';
import { fetchOrderStats } from '../services/ordersApi';

export function useOrderStats() {
  return useQuery({
    queryKey: ['orders', 'stats'],
    queryFn: fetchOrderStats,
    refetchInterval: 10_000,
  });
}
