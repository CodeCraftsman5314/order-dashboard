# Tapin — Order Dashboard

A live order dashboard for venue operators built with React + TypeScript.

## Getting started

```bash
npm install
npm run dev
```

---

## Approach

### Architecture

Feature-based folder structure under `src/`:

```
src/
  app/              # Providers, App shell
  features/
    orders/
      components/   # OrderDashboard, OrderCard, StatusFilter, StatusBadge
      hooks/        # useOrders, useOrdersRealtime
      services/     # ordersApi (mock)
      types.ts      # Order, OrderStatus, helpers
  shared/
    components/     # LoadingSpinner, EmptyState, ErrorMessage
    utils/          # formatters (cents → $, time since)
  lib/
    queryClient.ts  # TanStack Query config
    mockData.ts     # In-memory order store + helpers
```

Each feature owns its own types, services, hooks, and components. `shared/`
holds only things that have no feature-specific knowledge.

### State management

| Concern | Solution |
|---|---|
| Server / async state | TanStack Query (`useQuery`, `useMutation`) |
| UI filter state | `useState` in `OrderDashboard` |
| Global state | None — not needed for this scope |

TanStack Query was chosen over a manual `useEffect` + `useState` approach
because it gives us caching, deduplication, background refetches, and
`cancelQueries` for free — all of which the optimistic update pattern depends on.

### Optimistic updates

`useOrders` implements the standard TanStack Query optimistic pattern:

1. **`onMutate`** — cancel outgoing refetches → snapshot current cache → apply
   the status change immediately so the UI responds without a network round-trip.
2. **`onError`** — restore the snapshot, rolling back the card to its previous
   state. A 15 % artificial failure rate in `ordersApi.ts` lets you see this in
   action — just click "Advance" a few times.
3. **`onSettled`** — always invalidate so the cache reconciles with the server.

### Part 3 — Real-time (Option A)

`useOrdersRealtime` simulates an SSE connection via `setInterval`. In
production the hook body would be replaced with:

```ts
const sse = new EventSource('/api/orders/stream');

sse.addEventListener('order:new', (e) => {
  const order: Order = JSON.parse(e.data);
  queryClient.setQueriesData<OrdersResponse>(
    { queryKey: ['orders'] },
    (old) => old ? { ...old, orders: [order, ...old.orders], total: old.total + 1 } : old,
  );
});

sse.addEventListener('order:updated', (e) => {
  const updated: Order = JSON.parse(e.data);
  queryClient.setQueriesData<OrdersResponse>(
    { queryKey: ['orders'] },
    (old) => old
      ? { ...old, orders: old.orders.map((o) => (o.id === updated.id ? updated : o)) }
      : old,
  );
});

return () => sse.close();
```

The push handler writes directly into the React Query cache, so every
subscribed component re-renders without a network round-trip for the client.

---

## Tradeoffs

- **No pagination UI** — the API layer supports `page`, but the dashboard
  shows the first page only. With more time I'd add an infinite-scroll or
  numbered paginator.
- **Mock failure rate** — `FAILURE_RATE = 0.15` in `ordersApi.ts` is on by
  default to demonstrate rollback. Set it to `0` to remove random failures.
- **Single mutation slot** — one `useMutation` instance means clicking a
  second card while the first is in-flight will show the loading state on the
  second card only (the first finishes in the background). A `Map<id, status>`
  approach would handle concurrent mutations more precisely.
- **No toast library** — errors surface as an inline banner above the grid.
  In production I'd use `sonner` or similar for non-blocking toasts.

## What I'd add with more time

- Pagination or virtual scrolling (`@tanstack/react-virtual`) for 500+ orders
- Vitest + React Testing Library tests for `useOrders` (optimistic flow,
  rollback, empty/error states)
- A real SSE endpoint (Node/Express) replacing the polling simulation
- WebSocket fallback detection
- Keyboard-accessible status advancement
- `React.lazy` + route-level code splitting for a multi-page app
