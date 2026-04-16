interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = 'No orders found.' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-zinc-700">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-zinc-500">{message}</p>
      <p className="mt-1 text-xs text-zinc-700">New orders will appear here automatically.</p>
    </div>
  );
}
