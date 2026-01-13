import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import VideoPreview from './VideoPreview'
import type { VideoMetadata } from '@/types/video'

const mockMetadata: VideoMetadata = {
  name: 'test-video.mp4',
  duration: 125, // 2:05
  width: 1920,
  height: 1080,
  size: 52428800, // 50MB
  type: 'video/mp4',
}

describe('VideoPreview', () => {
  it('renders video element with correct src', () => {
    render(<VideoPreview src="blob:test-url" metadata={mockMetadata} />)
    const video = document.querySelector('video')
    expect(video).toHaveAttribute('src', 'blob:test-url')
  })

  it('displays video metadata', () => {
    render(<VideoPreview src="blob:test-url" metadata={mockMetadata} />)
    expect(screen.getByText('test-video.mp4')).toBeInTheDocument()
    expect(screen.getByText(/1920x1080/)).toBeInTheDocument()
    expect(screen.getByText(/2:05/)).toBeInTheDocument()
    expect(screen.getByText(/50\.0 MB/)).toBeInTheDocument()
  })

  it('shows remove button when onRemove is provided', () => {
    const onRemove = vi.fn()
    render(
      <VideoPreview
        src="blob:test-url"
        metadata={mockMetadata}
        onRemove={onRemove}
      />
    )
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument()
  })

  it('does not show remove button when onRemove is not provided', () => {
    render(<VideoPreview src="blob:test-url" metadata={mockMetadata} />)
    expect(
      screen.queryByRole('button', { name: /remove/i })
    ).not.toBeInTheDocument()
  })

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = vi.fn()
    render(
      <VideoPreview
        src="blob:test-url"
        metadata={mockMetadata}
        onRemove={onRemove}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /remove/i }))
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('has play/pause button', () => {
    render(<VideoPreview src="blob:test-url" metadata={mockMetadata} />)
    expect(
      screen.getByRole('button', { name: /play video/i })
    ).toBeInTheDocument()
  })

  it('formats short durations correctly', () => {
    const shortMetadata = { ...mockMetadata, duration: 5 }
    render(<VideoPreview src="blob:test-url" metadata={shortMetadata} />)
    expect(screen.getByText(/0:05/)).toBeInTheDocument()
  })
})
