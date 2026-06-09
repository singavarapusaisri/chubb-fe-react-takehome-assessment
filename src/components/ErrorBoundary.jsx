import { Component } from 'react';
import { Button } from './Button.jsx';

/**
 * ErrorBoundary Component
 * Catches React errors and displays a user-friendly error page.
 * Implements WCAG AA accessibility standards.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 max-w-md text-center border border-red-300 dark:border-red-700">
            <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
              Oops!
            </h1>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The application encountered an unexpected error. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details className="mb-6 text-left bg-gray-100 dark:bg-gray-700 p-4 rounded border border-gray-300 dark:border-gray-600">
                <summary className="font-mono text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                  Error Details
                </summary>
                <pre className="mt-2 text-xs overflow-auto max-h-40 text-gray-700 dark:text-gray-300">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
