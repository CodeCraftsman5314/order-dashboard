import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchOrders, updateOrderStatus } from '../services/ordersApi';
import type { Order, OrderStatus, OrdersResponse } from '../types';

interface UseOrdersOptions {
  status?: OrderStatus;
  page?: number;
}

export function useOrders({ status, page = 1 }: UseOrdersOptions = {}) {
  const queryClient = useQueryClient();
  const queryKey = ['orders', { status, page }] as const;

  const query = useQuery({
    queryKey,
    queryFn: () => fetchOrders({ status, page }),
  });

  const mutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: OrderStatus }) =>
      updateOrderStatus(id, newStatus),

    onMutate: async ({ id, newStatus }) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<OrdersResponse>(queryKey);

      queryClient.setQueryData<OrdersResponse>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          orders: old.orders.map((order): Order =>
            order.id === id
              ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
              : order,
          ),
        };
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    orders: query.data?.orders ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    updateStatus: (id: string, newStatus: OrderStatus) =>
      mutation.mutate({ id, newStatus }),
    updatingId: mutation.isPending ? mutation.variables?.id : null,
    updateError: mutation.isError ? mutation.error : null,
  };
}
