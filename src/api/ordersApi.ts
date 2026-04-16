import { getMockOrders, updateMockOrder } from '../lib/mockData';
import { AppError, ErrorCode } from '../lib/errors';
import { OrderStatus } from '../types/orders';
import type { Order, OrderStats, OrdersResponse } from '../types/orders';

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

  const stats: OrderStats = {
    [OrderStatus.Pending]:   0,
    [OrderStatus.Preparing]: 0,
    [OrderStatus.Ready]:     0,
    [OrderStatus.Completed]: 0,
    [OrderStatus.Cancelled]: 0,
  };

  for (const order of all) {
    stats[order.status]++;
  }

  return stats;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  await delay(LATENCY_MS);

  if (Math.random() < FAILURE_RATE) {
    throw new AppError('Network error: failed to update order status', ErrorCode.UpdateFailed);
  }

  const updated = updateMockOrder(id, status);
  if (!updated) throw new AppError(`Order ${id} not found`, ErrorCode.NotFound);

  return updated;
}
