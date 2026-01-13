import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorBoundary from './ErrorBoundary'

// Component that throws an error
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error message')
  }
  return <div>Normal content</div>
}

describe('ErrorBoundary', () => {
  // Suppress console.error for cleaner test output
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('renders error UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('displays helpful message in error state', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText(/unexpected error occurred/i)).toBeInTheDocument()
    expect(screen.getByText(/try again or refresh/i)).toBeInTheDocument()
  })

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div>Custom error fallback</div>}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error fallback')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('resets error state when Try Again is clicked', async () => {
    const user = userEvent.setup()

    // Use a stateful wrapper to control error throwing
    let shouldThrow = true
    function ControlledThrow() {
      if (shouldThrow) {
        throw new Error('Controlled error')
      }
      return <div>Recovered content</div>
    }

    const { rerender } = render(
      <ErrorBoundary>
        <ControlledThrow />
      </ErrorBoundary>
    )

    // Should show error UI
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    // Fix the error condition
    shouldThrow = false

    // Click Try Again
    await user.click(screen.getByRole('button', { name: /try again/i }))

    // Re-render to pick up the fixed state
    rerender(
      <ErrorBoundary>
        <ControlledThrow />
      </ErrorBoundary>
    )

    // Should show recovered content
    expect(screen.getByText('Recovered content')).toBeInTheDocument()
  })

  it('logs error to console', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(consoleSpy).toHaveBeenCalled()
    // Check that error was logged
    const calls = consoleSpy.mock.calls
    const errorCall = calls.find((call) =>
      call.some((arg) => String(arg).includes('ErrorBoundary'))
    )
    expect(errorCall).toBeDefined()
  })

  it('shows error icon in error state', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    // SVG icon should be present and hidden from screen readers
    const svg = document.querySelector('svg[aria-hidden="true"]')
    expect(svg).toBeInTheDocument()
  })

  it('renders multiple children normally', () => {
    render(
      <ErrorBoundary>
        <div>First child</div>
        <div>Second child</div>
        <div>Third child</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('First child')).toBeInTheDocument()
    expect(screen.getByText('Second child')).toBeInTheDocument()
    expect(screen.getByText('Third child')).toBeInTheDocument()
  })
})
