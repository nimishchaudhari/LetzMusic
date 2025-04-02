import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorBoundary - Catches JavaScript errors anywhere in its child component tree.
 * 
 * This component will display a fallback UI instead of crashing the whole app
 * when an unhandled error occurs in any of its children.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.setState({ errorInfo });
    
    // If onError prop is provided, call it with the error details
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.state.errorInfo);
      }

      // Default error UI
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Show error details</summary>
            <p>{this.state.error && this.state.error.toString()}</p>
            <p>Component Stack:</p>
            <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
          </details>
          {this.props.showReset && (
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
                if (this.props.onReset) {
                  this.props.onReset();
                }
              }}
              className="reset-button"
            >
              Try Again
            </button>
          )}
        </div>
      );
    }

    // If no error, render children
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.func,
  onError: PropTypes.func,
  onReset: PropTypes.func,
  showReset: PropTypes.bool
};

ErrorBoundary.defaultProps = {
  showReset: true
};

export default ErrorBoundary;
