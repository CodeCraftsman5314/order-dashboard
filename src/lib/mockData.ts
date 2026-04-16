import type { Order, OrderStatus } from '../features/orders/types';

const GUEST_NAMES = [
  'Alice Johnson',
  'Bob Martinez',
  'Carol Chen',
  'David Kim',
  'Emma Wilson',
  'Frank Rivera',
  'Grace Lee',
  'Henry Thompson',
  'Isla Brown',
  'Jack Davis',
];

const MENU_ITEMS = [
  { name: 'IPA Draft', price: 800 },
  { name: 'House Red', price: 1200 },
  { name: 'Whiskey Sour', price: 1400 },
  { name: 'Nachos', price: 1100 },
  { name: 'Chicken Wings', price: 1600 },
  { name: 'Mojito', price: 1300 },
  { name: 'Sparkling Water', price: 400 },
  { name: 'Loaded Fries', price: 900 },
  { name: 'Margarita', price: 1500 },
  { name: 'Caesar Salad', price: 1400 },
];

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildItems() {
  const count = Math.floor(Math.random() * 3) + 1;
  return Array.from({ length: count }, () => {
    const { name, price } = randomPick(MENU_ITEMS);
    return { name, price, quantity: Math.floor(Math.random() * 2) + 1 };
  });
}

function makeOrder(id: string, status: OrderStatus, minutesAgo: number): Order {
  const items = buildItems();
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const createdAt = new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();
  return {
    id,
    guestName: randomPick(GUEST_NAMES),
    items,
    status,
    createdAt,
    updatedAt: createdAt,
    total,
  };
}

let store: Order[] = [
  makeOrder('1', 'pending', 2),
  makeOrder('2', 'pending', 4),
  makeOrder('3', 'preparing', 8),
  makeOrder('4', 'preparing', 12),
  makeOrder('5', 'ready', 15),
  makeOrder('6', 'completed', 25),
  makeOrder('7', 'cancelled', 30),
  makeOrder('8', 'pending', 1),
];

let nextId = 100;

export function getMockOrders(): Order[] {
  return [...store];
}

export function updateMockOrder(id: string, status: OrderStatus): Order | null {
  const idx = store.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  store[idx] = { ...store[idx], status, updatedAt: new Date().toISOString() };
  return { ...store[idx] };
}

export function addMockOrder(): Order {
  nextId += 1;
  const order = makeOrder(String(nextId), 'pending', 0);
  store = [order, ...store];
  return order;
}
