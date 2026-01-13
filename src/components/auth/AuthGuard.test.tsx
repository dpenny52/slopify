import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AuthGuard from './AuthGuard'

const mockUseConvexAuth = vi.fn()

vi.mock('convex/react', () => ({
  useConvexAuth: () => mockUseConvexAuth(),
}))

describe('AuthGuard', () => {
  it('shows loading spinner while loading', () => {
    mockUseConvexAuth.mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
    })

    render(
      <AuthGuard fallback={<div>Please log in</div>}>
        <div>Protected content</div>
      </AuthGuard>
    )

    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/please log in/i)).not.toBeInTheDocument()
  })

  it('shows fallback when not authenticated', () => {
    mockUseConvexAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
    })

    render(
      <AuthGuard fallback={<div>Please log in</div>}>
        <div>Protected content</div>
      </AuthGuard>
    )

    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument()
    expect(screen.getByText(/please log in/i)).toBeInTheDocument()
  })

  it('shows children when authenticated', () => {
    mockUseConvexAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
    })

    render(
      <AuthGuard fallback={<div>Please log in</div>}>
        <div>Protected content</div>
      </AuthGuard>
    )

    expect(screen.getByText(/protected content/i)).toBeInTheDocument()
    expect(screen.queryByText(/please log in/i)).not.toBeInTheDocument()
  })

  it('renders nothing as fallback when not provided', () => {
    mockUseConvexAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
    })

    const { container } = render(
      <AuthGuard>
        <div>Protected content</div>
      </AuthGuard>
    )

    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument()
    expect(container.textContent).toBe('')
  })
})
