import { OrderDashboard } from '../pages/OrderDashboard';
import { ErrorBoundary } from '../components';

export function App() {
  return (
    <ErrorBoundary>
      <OrderDashboard />
    </ErrorBoundary>
  );
}
