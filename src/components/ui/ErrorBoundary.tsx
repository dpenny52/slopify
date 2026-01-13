import { Component, ErrorInfo, ReactNode } from 'react'
import Button from './Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <svg
            className="w-16 h-16 text-red-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Something went wrong
          </h2>
          <p className="text-[var(--text-secondary)] mb-4 max-w-md">
            An unexpected error occurred. Please try again or refresh the page.
          </p>
          {this.state.error && (
            <p className="text-sm text-red-400 mb-4 font-mono">
              {this.state.error.message}
            </p>
          )}
          <Button variant="primary" onClick={this.handleReset}>
            Try Again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
