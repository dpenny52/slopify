import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DownloadButton from './DownloadButton'
import { formatFileSize, generateVideoFilename } from '@/lib/utils/format'

// Mock the muxer module
vi.mock('@/lib/video/muxer', () => ({
  downloadVideo: vi.fn(),
}))

import { downloadVideo } from '@/lib/video/muxer'

describe('DownloadButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(URL.createObjectURL).mockReturnValue('blob:test-url')
  })

  it('renders nothing when blob is null', () => {
    const { container } = render(<DownloadButton blob={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders download button when blob is provided', () => {
    const blob = new Blob(['test'], { type: 'video/mp4' })
    render(<DownloadButton blob={blob} />)

    expect(
      screen.getByRole('button', { name: /download video/i })
    ).toBeInTheDocument()
  })

  it('shows file size', () => {
    const blob = new Blob(['x'.repeat(1024 * 1024)], { type: 'video/mp4' }) // ~1MB
    render(<DownloadButton blob={blob} />)

    expect(screen.getByText(/MP4/)).toBeInTheDocument()
    expect(screen.getByText(/MB/)).toBeInTheDocument()
  })

  it('creates blob URL on mount', () => {
    const blob = new Blob(['test'], { type: 'video/mp4' })
    render(<DownloadButton blob={blob} />)

    expect(URL.createObjectURL).toHaveBeenCalledWith(blob)
  })

  it('revokes blob URL on unmount', () => {
    const blob = new Blob(['test'], { type: 'video/mp4' })
    const { unmount } = render(<DownloadButton blob={blob} />)

    unmount()

    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url')
  })

  it('triggers download on click', async () => {
    const user = userEvent.setup()
    const blob = new Blob(['test'], { type: 'video/mp4' })
    render(<DownloadButton blob={blob} />)

    await user.click(screen.getByRole('button', { name: /download video/i }))

    expect(downloadVideo).toHaveBeenCalledWith(
      blob,
      expect.stringMatching(/^slopify-video-.*\.mp4$/)
    )
  })

  it('calls downloadVideo on click', async () => {
    const user = userEvent.setup()
    const blob = new Blob(['test'], { type: 'video/mp4' })
    render(<DownloadButton blob={blob} />)

    await user.click(screen.getByRole('button', { name: /download video/i }))

    expect(downloadVideo).toHaveBeenCalled()
  })

  it('can be disabled', () => {
    const blob = new Blob(['test'], { type: 'video/mp4' })
    render(<DownloadButton blob={blob} disabled />)

    expect(screen.getByRole('button')).toBeDisabled()
  })
})

describe('formatFileSize', () => {
  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500.0 B')
  })

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB')
    expect(formatFileSize(1536)).toBe('1.5 KB')
  })

  it('formats megabytes', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1.0 MB')
    expect(formatFileSize(5.5 * 1024 * 1024)).toBe('5.5 MB')
  })

  it('formats gigabytes', () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.0 GB')
  })

  it('handles zero', () => {
    expect(formatFileSize(0)).toBe('0 B')
  })
})

describe('generateVideoFilename', () => {
  it('returns filename with slopify prefix', () => {
    const filename = generateVideoFilename()
    expect(filename).toMatch(/^slopify-video-/)
  })

  it('returns filename with mp4 extension', () => {
    const filename = generateVideoFilename()
    expect(filename).toMatch(/\.mp4$/)
  })

  it('includes timestamp in filename', () => {
    const filename = generateVideoFilename()
    // Should have format like: slopify-video-2024-01-15T10-30-45.mp4
    expect(filename).toMatch(
      /slopify-video-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.mp4/
    )
  })
})
