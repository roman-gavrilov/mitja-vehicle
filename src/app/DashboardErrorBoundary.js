'use client';

import React from 'react';
import { getESTTimestamp } from '@/app/utils/dateUtils';

function logError(source, errorData) {
  const timestamp = getESTTimestamp();
  const logEntry = `[${timestamp} EST] ${source}:\n${JSON.stringify(errorData, null, 2)}\n\n`;
    
  // Send to server for logging
  fetch('/api/log-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source, errorData }),
  }).catch(console.error); // Log any errors from the fetch itself
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logError(this.props.componentName || 'Dashboard Component Error', { error: error.toString(), errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-100 text-red-700">
          <h2 className="text-xl font-bold mb-2">An error occurred in the dashboard.</h2>
          <p>Error: {this.state.error.toString()}</p>
          <p>Please try again later or contact support if the problem persists.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export function DashboardErrorBoundary({ children }) {
  return (
    <ErrorBoundary componentName="Dashboard">
      {children}
    </ErrorBoundary>
  );
}