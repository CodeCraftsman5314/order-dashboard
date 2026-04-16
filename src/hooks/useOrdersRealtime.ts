import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { addMockOrder } from '../lib/mockData';

const SIMULATED_ORDER_INTERVAL_MS = 8_000;
const SIMULATED_ORDER_PROBABILITY  = 0.25;

export function useOrdersRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < SIMULATED_ORDER_PROBABILITY) {
        addMockOrder();
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      }
    }, SIMULATED_ORDER_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [queryClient]);
}
