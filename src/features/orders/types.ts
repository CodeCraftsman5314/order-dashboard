export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  guestName: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  total: number;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
}

export interface OrderStats {
  pending: number;
  preparing: number;
  ready: number;
  completed: number;
  cancelled: number;
}

const STATUS_FLOW = ['pending', 'preparing', 'ready', 'completed'] as const;
type ProgressiveStatus = (typeof STATUS_FLOW)[number];

export function getNextStatus(status: OrderStatus): OrderStatus | null {
  const index = STATUS_FLOW.indexOf(status as ProgressiveStatus);
  if (index === -1 || index === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[index + 1];
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  preparing: 'Preparing',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
};
