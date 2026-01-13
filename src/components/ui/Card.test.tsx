import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from './Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText(/card content/i)).toBeInTheDocument()
  })

  it('applies default padding', () => {
    render(<Card data-testid="card">Content</Card>)
    expect(screen.getByTestId('card')).toHaveClass('p-4')
  })

  it('applies custom padding', () => {
    const { rerender } = render(
      <Card padding="none" data-testid="card">
        Content
      </Card>
    )
    expect(screen.getByTestId('card')).not.toHaveClass('p-4')

    rerender(
      <Card padding="sm" data-testid="card">
        Content
      </Card>
    )
    expect(screen.getByTestId('card')).toHaveClass('p-3')

    rerender(
      <Card padding="lg" data-testid="card">
        Content
      </Card>
    )
    expect(screen.getByTestId('card')).toHaveClass('p-6')
  })

  it('applies custom className', () => {
    render(
      <Card className="custom-class" data-testid="card">
        Content
      </Card>
    )
    expect(screen.getByTestId('card')).toHaveClass('custom-class')
  })
})
