import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { ToastProvider } from './Toast'
import { useToast } from '@hooks/useToast'

function TestComponent() {
  const { showToast } = useToast()

  return (
    <div>
      <button onClick={() => showToast('Test message')}>Show Info</button>
      <button onClick={() => showToast('Success!', 'success')}>
        Show Success
      </button>
      <button onClick={() => showToast('Error!', 'error')}>Show Error</button>
      <button onClick={() => showToast('Warning!', 'warning')}>
        Show Warning
      </button>
    </div>
  )
}

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows toast when triggered', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /show info/i }))
    expect(screen.getByText(/test message/i)).toBeInTheDocument()
  })

  it('shows different toast types', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /show success/i }))
    expect(screen.getByText(/success!/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /show error/i }))
    expect(screen.getByText(/error!/i)).toBeInTheDocument()
  })

  it('auto-dismisses toast after timeout', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /show info/i }))
    expect(screen.getByText(/test message/i)).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(4000)
    })

    expect(screen.queryByText(/test message/i)).not.toBeInTheDocument()
  })

  it('can dismiss toast manually', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /show info/i }))
    expect(screen.getByText(/test message/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))
    expect(screen.queryByText(/test message/i)).not.toBeInTheDocument()
  })

  it('throws error when used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<TestComponent />)).toThrow(
      'useToast must be used within a ToastProvider'
    )

    consoleError.mockRestore()
  })
})
