import type { OrderStats, OrderStatus } from '../../types/orders';

export interface StatusFilterProps {
  activeStatus: OrderStatus | undefined;
  onChange: (status: OrderStatus | undefined) => void;
  stats?: OrderStats;
  total?: number;
}
