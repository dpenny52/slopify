import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import GridPreview from './GridPreview'
import type { OverlayVideo } from '@/types/overlay'

// Mock HTMLMediaElement.play for jsdom
beforeAll(() => {
  HTMLMediaElement.prototype.play = vi.fn().mockReturnValue(Promise.resolve())
})

afterAll(() => {
  vi.restoreAllMocks()
})

const mockOverlays: OverlayVideo[] = [
  {
    id: 'overlay-1',
    name: 'Overlay 1',
    description: 'Test overlay 1',
    src: '/test-1.mp4',
    thumbnailTime: 0,
  },
  {
    id: 'overlay-2',
    name: 'Overlay 2',
    description: 'Test overlay 2',
    src: '/test-2.mp4',
    thumbnailTime: 0,
  },
]

describe('GridPreview', () => {
  it('renders grid heading', () => {
    render(<GridPreview selectedOverlays={[]} />)
    expect(screen.getByText('Grid Preview')).toBeInTheDocument()
  })

  it('shows help text when no overlays selected', () => {
    render(<GridPreview selectedOverlays={[]} />)
    expect(
      screen.getByText(/select overlays to see the grid preview/i)
    ).toBeInTheDocument()
  })

  it('does not show help text when overlays selected', () => {
    render(<GridPreview selectedOverlays={mockOverlays} />)
    expect(
      screen.queryByText(/select overlays to see the grid preview/i)
    ).not.toBeInTheDocument()
  })

  it('renders grid container', () => {
    render(<GridPreview selectedOverlays={mockOverlays} />)
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('shows drag hint when multiple overlays', () => {
    render(<GridPreview selectedOverlays={mockOverlays} />)
    expect(screen.getByText('Drag to rearrange')).toBeInTheDocument()
  })

  it('does not show drag hint with single overlay', () => {
    render(<GridPreview selectedOverlays={[mockOverlays[0]!]} />)
    expect(screen.queryByText('Drag to rearrange')).not.toBeInTheDocument()
  })

  it('renders main video cell', () => {
    render(<GridPreview selectedOverlays={[]} />)
    expect(screen.getByText('Main Video')).toBeInTheDocument()
  })

  it('renders overlay labels', () => {
    render(<GridPreview selectedOverlays={mockOverlays} />)
    expect(screen.getByText('Overlay 1')).toBeInTheDocument()
    expect(screen.getByText('Overlay 2')).toBeInTheDocument()
  })

  it('calls onLayoutChange when overlays change', async () => {
    const onLayoutChange = vi.fn()
    render(
      <GridPreview
        selectedOverlays={mockOverlays}
        onLayoutChange={onLayoutChange}
      />
    )

    // Wait for useEffect to run
    await vi.waitFor(() => {
      expect(onLayoutChange).toHaveBeenCalled()
    })

    // Find a call with non-empty layout
    const callWithLayout = onLayoutChange.mock.calls.find(
      (call) => call[0] && call[0].length > 0
    )
    expect(callWithLayout).toBeDefined()
    if (callWithLayout) {
      const layoutArg = callWithLayout[0]
      expect(layoutArg).toHaveLength(2)
      expect(layoutArg[0]).toHaveProperty('id')
      expect(layoutArg[0]).toHaveProperty('position')
    }
  })

  it('renders video for main video when src provided', () => {
    render(
      <GridPreview
        selectedOverlays={mockOverlays}
        mainVideoSrc="/main-video.mp4"
      />
    )
    const videos = document.querySelectorAll('video')
    const mainVideo = Array.from(videos).find(
      (v) => v.getAttribute('src') === '/main-video.mp4'
    )
    expect(mainVideo).toBeTruthy()
  })
})
