import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import OverlayThumbnail from './OverlayThumbnail'
import type { OverlayVideo } from '@/types/overlay'

const mockOverlay: OverlayVideo = {
  id: 'overlay-1',
  name: 'Test Overlay',
  description: 'A test overlay video',
  src: '/sample-overlays/overlay-1.mp4',
  thumbnailTime: 2,
}

describe('OverlayThumbnail', () => {
  it('renders overlay name', () => {
    render(
      <OverlayThumbnail
        overlay={mockOverlay}
        isSelected={false}
        onToggle={() => {}}
      />
    )
    expect(screen.getByText('Test Overlay')).toBeInTheDocument()
  })

  it('has checkbox role with correct aria-checked', () => {
    const { rerender } = render(
      <OverlayThumbnail
        overlay={mockOverlay}
        isSelected={false}
        onToggle={() => {}}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-checked', 'false')

    rerender(
      <OverlayThumbnail
        overlay={mockOverlay}
        isSelected={true}
        onToggle={() => {}}
      />
    )
    expect(checkbox).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(
      <OverlayThumbnail
        overlay={mockOverlay}
        isSelected={false}
        onToggle={onToggle}
      />
    )

    fireEvent.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('calls onToggle on Enter key', () => {
    const onToggle = vi.fn()
    render(
      <OverlayThumbnail
        overlay={mockOverlay}
        isSelected={false}
        onToggle={onToggle}
      />
    )

    fireEvent.keyDown(screen.getByRole('checkbox'), { key: 'Enter' })
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('calls onToggle on Space key', () => {
    const onToggle = vi.fn()
    render(
      <OverlayThumbnail
        overlay={mockOverlay}
        isSelected={false}
        onToggle={onToggle}
      />
    )

    fireEvent.keyDown(screen.getByRole('checkbox'), { key: ' ' })
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('does not call onToggle when disabled', () => {
    const onToggle = vi.fn()
    render(
      <OverlayThumbnail
        overlay={mockOverlay}
        isSelected={false}
        disabled={true}
        onToggle={onToggle}
      />
    )

    fireEvent.click(screen.getByRole('checkbox'))
    expect(onToggle).not.toHaveBeenCalled()
  })

  it('has aria-disabled when disabled', () => {
    render(
      <OverlayThumbnail
        overlay={mockOverlay}
        isSelected={false}
        disabled={true}
        onToggle={() => {}}
      />
    )

    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-disabled',
      'true'
    )
  })

  it('has correct aria-label', () => {
    const { rerender } = render(
      <OverlayThumbnail
        overlay={mockOverlay}
        isSelected={false}
        onToggle={() => {}}
      />
    )

    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-label',
      'Test Overlay'
    )

    rerender(
      <OverlayThumbnail
        overlay={mockOverlay}
        isSelected={true}
        onToggle={() => {}}
      />
    )
    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-label',
      'Test Overlay (selected)'
    )
  })

  it('renders video element with correct src', () => {
    render(
      <OverlayThumbnail
        overlay={mockOverlay}
        isSelected={false}
        onToggle={() => {}}
      />
    )

    const video = document.querySelector('video')
    expect(video).toHaveAttribute('src', '/sample-overlays/overlay-1.mp4')
  })
})
