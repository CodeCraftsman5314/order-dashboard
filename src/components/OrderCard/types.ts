import type { Order, OrderStatus } from '../../types/orders';

export interface OrderCardProps {
  order: Order;
  onAdvanceStatus: (id: string, nextStatus: OrderStatus) => void;
  isUpdating: boolean;
}
