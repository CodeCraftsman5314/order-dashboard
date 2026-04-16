import clsx from 'clsx';
import { useOrderStats } from '../../hooks/useOrderStats';

const METRICS = [
  {
    key: 'pending' as const,
    label: 'Pending',
    border: 'border-l-amber-400',
    value: 'text-amber-400',
    bg: 'from-amber-500/7',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'preparing' as const,
    label: 'Preparing',
    border: 'border-l-blue-400',
    value: 'text-blue-400',
    bg: 'from-blue-500/7',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    key: 'ready' as const,
    label: 'Ready',
    border: 'border-l-emerald-400',
    value: 'text-emerald-400',
    bg: 'from-emerald-500/7',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
] as const;

function StatCard({
  label,
  value,
  border,
  valueClass,
  bg,
  icon,
  loading,
}: {
  label: string;
  value: number | undefined;
  border: string;
  valueClass: string;
  bg: string;
  icon: React.ReactNode;
  loading: boolean;
}) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-xl border border-zinc-800 border-l-accent',
        border,
        'bg-linear-to-br',
        bg,
        'to-zinc-900 p-4',
        'shadow-card transition-shadow duration-200 hover:shadow-card-hover',
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
          {label}
        </p>
        <span className={clsx(valueClass, 'opacity-60')}>{icon}</span>
      </div>

      {loading ? (
        <div className="mt-2 h-8 w-10 rounded-md skeleton" />
      ) : (
        <p className={clsx('mt-1.5 text-3xl font-bold tabular-nums', valueClass)}>
          {value ?? 0}
        </p>
      )}
    </div>
  );
}

export function StatsStrip() {
  const { stats, isLoading } = useOrderStats();

  const total = stats
    ? Object.values(stats).reduce((sum, n) => sum + n, 0)
    : undefined;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {METRICS.map(({ key, label, border, value, bg, icon }) => (
        <StatCard
          key={key}
          label={label}
          value={stats ? stats[key] : undefined}
          border={border}
          valueClass={value}
          bg={bg}
          icon={icon}
          loading={isLoading}
        />
      ))}

      <StatCard
        label="Total Today"
        value={total}
        border="border-l-violet-500"
        valueClass="text-zinc-100"
        bg="from-violet-500/6"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
        loading={isLoading}
      />
    </div>
  );
}
