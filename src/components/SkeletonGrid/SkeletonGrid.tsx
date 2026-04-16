function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-zinc-800 border-l-accent border-l-zinc-700 bg-zinc-900 p-4 shadow-card">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 shrink-0 rounded-full skeleton" />
        <div className="flex-1 space-y-2 pt-0.5">
          <div className="h-3.5 w-28 rounded-md skeleton" />
          <div className="h-3 w-16 rounded-md skeleton" />
        </div>
        <div className="h-3 w-14 rounded-full skeleton" />
      </div>

      <div className="my-3.5 border-t border-zinc-800" />

      <div className="space-y-2.5">
        <div className="flex justify-between gap-4">
          <div className="h-3 w-32 rounded-md skeleton" />
          <div className="h-3 w-12 rounded-md skeleton" />
        </div>
        <div className="flex justify-between gap-4">
          <div className="h-3 w-24 rounded-md skeleton" />
          <div className="h-3 w-12 rounded-md skeleton" />
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div className="space-y-1.5">
          <div className="h-2.5 w-8 rounded-md skeleton" />
          <div className="h-5 w-14 rounded-md skeleton" />
        </div>
        <div className="h-8 w-28 rounded-xl skeleton" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
