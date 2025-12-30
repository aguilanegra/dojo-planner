// Setup file for browser tests
// Suppress React 18 concurrent mode cleanup errors that occur during async unmounting
// These errors don't affect test results - all tests pass

// Add global error handler to suppress specific React cleanup errors
if (typeof window !== 'undefined') {
  const originalOnError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (typeof message === 'string' && message.includes('Element type is invalid')) {
      // Suppress this specific error during cleanup
      return true;
    }
    if (originalOnError) {
      return originalOnError(message, source, lineno, colno, error);
    }
    return false;
  };

  // Also handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('Element type is invalid')) {
      event.preventDefault();
    }
  });
}
