export const OrderStatus = {
  Pending:   'pending',
  Preparing: 'preparing',
  Ready:     'ready',
  Completed: 'completed',
  Cancelled: 'cancelled',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

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

const STATUS_FLOW = [
  OrderStatus.Pending,
  OrderStatus.Preparing,
  OrderStatus.Ready,
  OrderStatus.Completed,
] as const;

export function getNextStatus(status: OrderStatus): OrderStatus | null {
  const index = STATUS_FLOW.indexOf(status as (typeof STATUS_FLOW)[number]);
  if (index === -1 || index === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[index + 1];
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.Pending]:   'Pending',
  [OrderStatus.Preparing]: 'Preparing',
  [OrderStatus.Ready]:     'Ready',
  [OrderStatus.Completed]: 'Completed',
  [OrderStatus.Cancelled]: 'Cancelled',
};
