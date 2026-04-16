import clsx from 'clsx';
import { OrderStatus } from '../../types/orders';

const CONFIG: Record<
  OrderStatus,
  { label: string; dot: string; text: string }
> = {
  [OrderStatus.Pending]:   { label: 'Pending',   dot: 'bg-amber-400',   text: 'text-amber-400'   },
  [OrderStatus.Preparing]: { label: 'Preparing', dot: 'bg-blue-400',    text: 'text-blue-400'    },
  [OrderStatus.Ready]:     { label: 'Ready',     dot: 'bg-emerald-400', text: 'text-emerald-400' },
  [OrderStatus.Completed]: { label: 'Completed', dot: 'bg-zinc-500',    text: 'text-zinc-500'    },
  [OrderStatus.Cancelled]: { label: 'Cancelled', dot: 'bg-red-400',     text: 'text-red-400'     },
};

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, dot, text } = CONFIG[status];
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5">
      <span className={clsx('h-1.5 w-1.5 rounded-full', dot)} />
      <span className={clsx('text-xs font-medium', text)}>{label}</span>
    </span>
  );
}
