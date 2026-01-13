import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from './Input'

describe('Input', () => {
  it('renders with default props', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('handles user input', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Input label="Name" onChange={handleChange} />)

    const input = screen.getByLabelText(/name/i)
    await user.type(input, 'John')

    expect(handleChange).toHaveBeenCalled()
    expect(input).toHaveValue('John')
  })

  it('displays error message', () => {
    render(<Input label="Email" error="Invalid email address" />)

    expect(screen.getByRole('alert')).toHaveTextContent(/invalid email/i)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('can be disabled', () => {
    render(<Input label="Email" disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('shows placeholder text', () => {
    render(<Input placeholder="Enter your email" />)
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument()
  })

  it('generates id from label', () => {
    render(<Input label="Full Name" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', 'full-name')
  })

  it('uses custom id when provided', () => {
    render(<Input label="Email" id="custom-id" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'custom-id')
  })
})
