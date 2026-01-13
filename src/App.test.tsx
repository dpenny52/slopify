import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

vi.mock('convex/react', () => ({
  useConvexAuth: () => ({ isLoading: false, isAuthenticated: false }),
}))

vi.mock('@convex-dev/auth/react', () => ({
  useAuthActions: () => ({ signOut: vi.fn() }),
}))

vi.mock('@/lib/video', () => ({
  checkBrowserCompatibility: () => ({
    supported: true,
    videoDecoder: true,
    videoEncoder: true,
    offscreenCanvas: true,
    webWorker: true,
    missingFeatures: [],
  }),
  getCompatibilityMessage: () => '',
}))

vi.mock('@/hooks/useVideoProcessor', () => ({
  useVideoProcessor: () => ({
    isProcessing: false,
    progress: null,
    error: null,
    outputBlob: null,
    processVideos: vi.fn(),
    cancelProcessing: vi.fn(),
    clearOutput: vi.fn(),
    downloadOutput: vi.fn(),
    browserCompatibility: {
      supported: true,
      videoDecoder: true,
      videoEncoder: true,
      offscreenCanvas: true,
      webWorker: true,
      missingFeatures: [],
    },
  }),
}))

describe('App', () => {
  it('renders homepage by default', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(
      screen.getByRole('heading', { name: /slopify/i, level: 1 })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /get started/i })
    ).toBeInTheDocument()
  })

  it('renders editor page on /editor route', () => {
    render(
      <MemoryRouter initialEntries={['/editor']}>
        <App />
      </MemoryRouter>
    )
    expect(
      screen.getByRole('heading', { name: /create your video/i, level: 1 })
    ).toBeInTheDocument()
  })

  it('has navigation links', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^editor$/i })).toBeInTheDocument()
  })
})
