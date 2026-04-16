import { memo } from 'react';
import type { Order, OrderStatus } from '../types';
import { getNextStatus, STATUS_LABELS } from '../types';
import { StatusBadge } from './StatusBadge';
import { formatCents, formatTimeSince, getAgeMinutes } from '../../../shared/utils/formatters';

const STATUS_BORDER: Record<OrderStatus, string> = {
  pending:   'border-l-amber-400',
  preparing: 'border-l-blue-400',
  ready:     'border-l-emerald-400',
  completed: 'border-l-zinc-700',
  cancelled: 'border-l-red-500',
};

const STATUS_GLOW: Record<OrderStatus, string> = {
  pending:   'from-amber-500/5',
  preparing: 'from-blue-500/5',
  ready:     'from-emerald-500/5',
  completed: 'from-zinc-500/3',
  cancelled: 'from-red-500/5',
};

const ADVANCE_BTN: Partial<Record<OrderStatus, string>> = {
  pending:   'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/40',
  preparing: 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/40',
  ready:     'bg-zinc-700 hover:bg-zinc-600 shadow-lg shadow-black/30',
};

type UrgencyLevel = 'urgent' | 'warning' | 'normal';

function getUrgency(createdAt: string, status: OrderStatus): UrgencyLevel {
  if (status === 'completed' || status === 'cancelled') return 'normal';
  const age = getAgeMinutes(createdAt);
  if (age >= 15) return 'urgent';
  if (age >= 8) return 'warning';
  return 'normal';
}

const URGENCY_TIME_CLASS: Record<UrgencyLevel, string> = {
  normal:  'text-zinc-600',
  warning: 'text-amber-500',
  urgent:  'text-red-400 font-medium',
};

function Avatar({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const letters =
    parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : parts[0].substring(0, 2);
  return (
    <div className="flex h-8 w-8 flex-shrink-0 select-none items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-300 ring-1 ring-white/8">
      {letters.toUpperCase()}
    </div>
  );
}

interface OrderCardProps {
  order: Order;
  onAdvanceStatus: (id: string, nextStatus: OrderStatus) => void;
  isUpdating: boolean;
}

export const OrderCard = memo(function OrderCard({
  order,
  onAdvanceStatus,
  isUpdating,
}: OrderCardProps) {
  const nextStatus = getNextStatus(order.status);
  const btnClass   = nextStatus ? ADVANCE_BTN[order.status] : undefined;
  const urgency    = getUrgency(order.createdAt, order.status);
  const timeText   = formatTimeSince(order.createdAt);

  return (
    <article
      className={[
        'relative overflow-hidden rounded-2xl',
        'bg-gradient-to-br', STATUS_GLOW[order.status], 'to-zinc-900',
        'border border-zinc-800 border-l-accent', STATUS_BORDER[order.status],
        'shadow-card transition-all duration-200',
        isUpdating
          ? 'scale-[0.99] opacity-50'
          : 'hover:-translate-y-0.5 hover:shadow-card-hover hover:border-zinc-700',
        'animate-fade-in',
      ].join(' ')}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Avatar name={order.guestName} />

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold text-zinc-100">
                {order.guestName}
              </p>
              <StatusBadge status={order.status} />
            </div>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="text-xs text-zinc-700">
                #{order.id.padStart(3, '0')}
              </span>
              <span className="text-zinc-800">&middot;</span>

              {urgency === 'urgent' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {urgency === 'warning' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-amber-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              )}

              <span className={`text-xs ${URGENCY_TIME_CLASS[urgency]}`}>
                {timeText}
              </span>
            </div>
          </div>
        </div>

        <div className="my-3.5 border-t border-zinc-800/80" />

        <ul className="space-y-1.5">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-baseline gap-2">
              <span className="min-w-0 flex-1 truncate text-sm text-zinc-400">
                {item.name}
              </span>
              <span className="flex-shrink-0 rounded-md bg-zinc-800/60 px-1.5 py-0.5 text-badge font-medium tabular-nums text-zinc-500">
                &times;{item.quantity}
              </span>
              <span className="w-14 flex-shrink-0 text-right text-sm tabular-nums text-zinc-300">
                {formatCents(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-badge font-semibold uppercase tracking-widest text-zinc-700">
              Total
            </p>
            <p className="text-xl font-bold tabular-nums text-zinc-100">
              {formatCents(order.total)}
            </p>
          </div>

          {nextStatus && btnClass && (
            <button
              onClick={() => onAdvanceStatus(order.id, nextStatus)}
              disabled={isUpdating}
              className={[
                'flex items-center gap-2 rounded-xl px-3.5 py-2',
                'text-xs font-semibold text-white',
                'transition-all duration-150 active:scale-95',
                'disabled:cursor-not-allowed disabled:opacity-40',
                btnClass,
              ].join(' ')}
            >
              {isUpdating ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  {STATUS_LABELS[nextStatus]}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
});
