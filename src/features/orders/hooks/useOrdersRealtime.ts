import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { addMockOrder } from '../../../lib/mockData';

export function useOrdersRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.25) {
        addMockOrder();
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      }
    }, 8_000);

    return () => clearInterval(interval);
  }, [queryClient]);
}
