import clsx from 'clsx';
import { OrderStatus } from '../../types/orders';
import type { OrderStats } from '../../types/orders';
import type { StatusFilterProps } from './types';

const FILTERS: {
  label: string;
  value: OrderStatus | undefined;
  statsKey: keyof OrderStats | null;
  activeClass: string;
  countClass: string;
}[] = [
  {
    label: 'All',
    value: undefined,
    statsKey: null,
    activeClass: 'border-zinc-500 bg-zinc-100 text-zinc-900',
    countClass:  'bg-zinc-700 text-zinc-300',
  },
  {
    label: 'Pending',
    value: OrderStatus.Pending,
    statsKey: 'pending',
    activeClass: 'border-amber-400/60 bg-amber-400/10 text-amber-300',
    countClass:  'bg-amber-400/20 text-amber-400',
  },
  {
    label: 'Preparing',
    value: OrderStatus.Preparing,
    statsKey: 'preparing',
    activeClass: 'border-blue-400/60 bg-blue-400/10 text-blue-300',
    countClass:  'bg-blue-400/20 text-blue-400',
  },
  {
    label: 'Ready',
    value: OrderStatus.Ready,
    statsKey: 'ready',
    activeClass: 'border-emerald-400/60 bg-emerald-400/10 text-emerald-300',
    countClass:  'bg-emerald-400/20 text-emerald-400',
  },
  {
    label: 'Completed',
    value: OrderStatus.Completed,
    statsKey: 'completed',
    activeClass: 'border-zinc-500/60 bg-zinc-700/30 text-zinc-400',
    countClass:  'bg-zinc-700/50 text-zinc-500',
  },
  {
    label: 'Cancelled',
    value: OrderStatus.Cancelled,
    statsKey: 'cancelled',
    activeClass: 'border-red-400/50 bg-red-400/10 text-red-400',
    countClass:  'bg-red-400/20 text-red-400',
  },
];

export function StatusFilter({
  activeStatus,
  onChange,
  stats,
  total,
}: StatusFilterProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter orders by status"
    >
      {FILTERS.map(({ label, value, statsKey, activeClass, countClass }) => {
        const isActive = activeStatus === value;
        const count = statsKey !== null ? (stats ? stats[statsKey] : undefined) : total;

        return (
          <button
            key={label}
            onClick={() => onChange(value)}
            aria-pressed={isActive}
            className={clsx(
              'flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5',
              'text-sm font-medium transition-all duration-150',
              isActive
                ? activeClass
                : 'border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300',
            )}
          >
            {label}
            {count !== undefined && (
              <span
                className={clsx(
                  'rounded-full px-1.5 py-0.5 text-badge font-semibold tabular-nums',
                  isActive ? countClass : 'bg-zinc-800 text-zinc-600',
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
