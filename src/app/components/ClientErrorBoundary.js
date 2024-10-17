'use client';

import React from 'react';

function logError(source, errorData) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${source}:\n${JSON.stringify(errorData, null, 2)}\n\n`;
  
  console.error('Client-side error:', logEntry);
  
  // In a real-world scenario, you might want to send this error to your server
  // using an API call here
}

class ClientErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logError('Client-side Error', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 text-red-700">
          <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h1>
          <p>We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ClientErrorBoundary;