import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LoginForm from './LoginForm'

vi.mock('@convex-dev/auth/react', () => ({
  useAuthActions: () => ({
    signIn: vi.fn(),
  }),
}))

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<LoginForm />)
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('shows error for empty email', () => {
    render(<LoginForm />)
    fireEvent.click(screen.getByRole('button', { name: /log in/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/email is required/i)
  })

  it('shows error for empty password', () => {
    render(<LoginForm />)
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /log in/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/password is required/i)
  })

  it('renders switch to signup link when callback provided', () => {
    const onSwitch = vi.fn()
    render(<LoginForm onSwitchToSignup={onSwitch} />)

    const signupLink = screen.getByRole('button', { name: /sign up/i })
    expect(signupLink).toBeInTheDocument()

    fireEvent.click(signupLink)
    expect(onSwitch).toHaveBeenCalledTimes(1)
  })
})
