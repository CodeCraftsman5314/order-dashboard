import { getMockOrders, updateMockOrder } from '../../../lib/mockData';
import type { Order, OrderStats, OrderStatus, OrdersResponse } from '../types';

const PAGE_SIZE = 20;
const LATENCY_MS = 700;
const FAILURE_RATE = 0.15;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchOrders({
  status,
  page = 1,
}: {
  status?: OrderStatus;
  page?: number;
}): Promise<OrdersResponse> {
  await delay(LATENCY_MS);

  const all = getMockOrders();
  const filtered = status ? all.filter((o) => o.status === status) : all;
  const start = (page - 1) * PAGE_SIZE;

  return {
    orders: filtered.slice(start, start + PAGE_SIZE),
    total: filtered.length,
    page,
    pageSize: PAGE_SIZE,
  };
}

export async function fetchOrderStats(): Promise<OrderStats> {
  await delay(LATENCY_MS / 2);
  const all = getMockOrders();
  return {
    pending:   all.filter((o) => o.status === 'pending').length,
    preparing: all.filter((o) => o.status === 'preparing').length,
    ready:     all.filter((o) => o.status === 'ready').length,
    completed: all.filter((o) => o.status === 'completed').length,
    cancelled: all.filter((o) => o.status === 'cancelled').length,
  };
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  await delay(LATENCY_MS);

  if (Math.random() < FAILURE_RATE) {
    throw new Error('Network error: failed to update order status');
  }

  const updated = updateMockOrder(id, status);
  if (!updated) throw new Error(`Order ${id} not found`);

  return updated;
}
