import { Component } from 'react';
import { getErrorMessage } from '../../lib/errors';
import { ErrorMessage } from '../ErrorMessage';
import type { ErrorBoundaryProps, ErrorBoundaryState } from './types';

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error !== null) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-screen items-center justify-center p-6 bg-zinc-950">
            <ErrorMessage message={getErrorMessage(this.state.error)} />
          </div>
        )
      );
    }
    return this.props.children;
  }
}
