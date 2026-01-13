import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgressBar from './ProgressBar'

describe('ProgressBar', () => {
  it('renders with correct progress', () => {
    render(<ProgressBar progress={50} />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuenow', '50')
  })

  it('shows label when enabled', () => {
    render(<ProgressBar progress={75} showLabel />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('clamps progress to 0-100 range', () => {
    const { rerender } = render(<ProgressBar progress={-10} showLabel />)
    expect(screen.getByText('0%')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '0'
    )

    rerender(<ProgressBar progress={150} showLabel />)
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '100'
    )
  })

  it('applies different sizes', () => {
    const { rerender, container } = render(
      <ProgressBar progress={50} size="sm" />
    )
    expect(container.querySelector('.h-1')).toBeInTheDocument()

    rerender(<ProgressBar progress={50} size="md" />)
    expect(container.querySelector('.h-2')).toBeInTheDocument()

    rerender(<ProgressBar progress={50} size="lg" />)
    expect(container.querySelector('.h-3')).toBeInTheDocument()
  })

  it('has correct ARIA attributes', () => {
    render(<ProgressBar progress={25} />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuemin', '0')
    expect(progressbar).toHaveAttribute('aria-valuemax', '100')
  })
})
