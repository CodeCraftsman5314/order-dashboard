import type { OrderStatus } from '../types';

const CONFIG: Record<
  OrderStatus,
  { label: string; dot: string; text: string }
> = {
  pending:   { label: 'Pending',   dot: 'bg-amber-400',   text: 'text-amber-400'   },
  preparing: { label: 'Preparing', dot: 'bg-blue-400',    text: 'text-blue-400'    },
  ready:     { label: 'Ready',     dot: 'bg-emerald-400', text: 'text-emerald-400' },
  completed: { label: 'Completed', dot: 'bg-zinc-500',    text: 'text-zinc-500'    },
  cancelled: { label: 'Cancelled', dot: 'bg-red-400',     text: 'text-red-400'     },
};

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, dot, text } = CONFIG[status];
  return (
    <span className="inline-flex flex-shrink-0 items-center gap-1.5">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      <span className={`text-xs font-medium ${text}`}>{label}</span>
    </span>
  );
}
