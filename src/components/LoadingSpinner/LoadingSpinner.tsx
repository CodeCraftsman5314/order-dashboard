export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-800 border-t-violet-500" />
      <p className="text-xs text-zinc-600">Loading orders…</p>
    </div>
  );
}
