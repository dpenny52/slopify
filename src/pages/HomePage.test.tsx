import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from './HomePage'

describe('HomePage', () => {
  it('renders with branding', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    expect(
      screen.getByRole('heading', { name: /slopify/i, level: 1 })
    ).toBeInTheDocument()
  })

  it('displays description text', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    expect(screen.getByText(/composite your videos/i)).toBeInTheDocument()
  })

  it('has Get Started button linking to editor', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    const link = screen.getByRole('link', { name: /get started/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/editor')
  })

  it('displays feature cards', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    expect(
      screen.getByRole('heading', { name: /^upload$/i, level: 3 })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /select overlays/i, level: 3 })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /^download$/i, level: 3 })
    ).toBeInTheDocument()
  })
})
