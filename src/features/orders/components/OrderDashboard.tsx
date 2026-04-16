import { useState } from 'react';
import type { OrderStatus } from '../types';
import { useOrders } from '../hooks/useOrders';
import { useOrderStats } from '../hooks/useOrderStats';
import { useOrdersRealtime } from '../hooks/useOrdersRealtime';
import { StatsStrip } from './StatsStrip';
import { StatusFilter } from './StatusFilter';
import { OrderCard } from './OrderCard';
import { SkeletonGrid } from './SkeletonGrid';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { EmptyState } from '../../../shared/components/EmptyState';
import { formatDay } from '../../../shared/utils/formatters';

export function OrderDashboard() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>();

  const {
    orders,
    total,
    isLoading,
    isError,
    error,
    updateStatus,
    updatingId,
    updateError,
  } = useOrders({ status: statusFilter });

  const { data: stats } = useOrderStats();

  useOrdersRealtime();

  const errorMessage =
    error instanceof Error ? error.message : 'Failed to load orders.';

  const totalAll = stats
    ? stats.pending + stats.preparing + stats.ready + stats.completed + stats.cancelled
    : undefined;

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-logo font-black tracking-wider text-white shadow-lg shadow-violet-900/50 select-none">
              T
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold tracking-widest text-zinc-100">
                TAPIN
              </span>
              <span className="hidden text-xs text-zinc-600 sm:inline">
                Order Dashboard
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-zinc-600 md:block">
              {formatDay(new Date())}
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-800/50 bg-emerald-950/60 px-2.5 py-1 text-xs font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Live
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-7">
          <StatsStrip />
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-200">Orders</h2>
            {!isLoading && (
              <p className="mt-0.5 text-xs text-zinc-600">
                {total} order{total !== 1 ? 's' : ''}{' '}
                {statusFilter ? `with status "${statusFilter}"` : 'across all statuses'}
              </p>
            )}
          </div>

          <StatusFilter
            activeStatus={statusFilter}
            onChange={setStatusFilter}
            stats={stats}
            total={totalAll}
          />
        </div>

        {updateError && (
          <div className="mb-5">
            <ErrorMessage message="Status update failed — changes reverted. Please try again." />
          </div>
        )}

        {isLoading && <SkeletonGrid />}

        {isError && <ErrorMessage message={errorMessage} />}

        {!isLoading && !isError && orders.length === 0 && (
          <EmptyState
            message={
              statusFilter
                ? `No ${statusFilter} orders right now.`
                : 'No orders yet.'
            }
          />
        )}

        {!isLoading && !isError && orders.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAdvanceStatus={updateStatus}
                isUpdating={updatingId === order.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
