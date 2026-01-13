import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SignupForm from './SignupForm'

vi.mock('@convex-dev/auth/react', () => ({
  useAuthActions: () => ({
    signIn: vi.fn(),
  }),
}))

describe('SignupForm', () => {
  it('renders email, password, and confirm password fields', () => {
    render(<SignupForm />)
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<SignupForm />)
    expect(
      screen.getByRole('button', { name: /create account/i })
    ).toBeInTheDocument()
  })

  it('shows error for empty email on submit', () => {
    render(<SignupForm />)

    const form = screen
      .getByRole('button', { name: /create account/i })
      .closest('form')
    fireEvent.submit(form!)

    expect(screen.getByRole('alert')).toHaveTextContent(/email is required/i)
  })

  it('validates email format', () => {
    render(<SignupForm />)

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'notanemail' },
    })

    const form = screen
      .getByRole('button', { name: /create account/i })
      .closest('form')
    fireEvent.submit(form!)

    expect(screen.getByRole('alert')).toHaveTextContent(/valid email/i)
  })

  it('validates password length', () => {
    render(<SignupForm />)

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'short' },
    })

    const form = screen
      .getByRole('button', { name: /create account/i })
      .closest('form')
    fireEvent.submit(form!)

    expect(screen.getByRole('alert')).toHaveTextContent(
      /at least 8 characters/i
    )
  })

  it('validates password match', () => {
    render(<SignupForm />)

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'different123' },
    })

    const form = screen
      .getByRole('button', { name: /create account/i })
      .closest('form')
    fireEvent.submit(form!)

    expect(screen.getByRole('alert')).toHaveTextContent(/do not match/i)
  })

  it('renders switch to login link when callback provided', () => {
    const onSwitch = vi.fn()
    render(<SignupForm onSwitchToLogin={onSwitch} />)

    const loginLink = screen.getByRole('button', { name: /log in/i })
    expect(loginLink).toBeInTheDocument()

    fireEvent.click(loginLink)
    expect(onSwitch).toHaveBeenCalledTimes(1)
  })
})
