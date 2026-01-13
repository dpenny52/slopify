import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GridCell from './GridCell'
import { GRID_CENTER } from '@/types/grid'

// Mock HTMLMediaElement.play for jsdom
beforeAll(() => {
  HTMLMediaElement.prototype.play = vi.fn().mockReturnValue(Promise.resolve())
})

afterAll(() => {
  vi.restoreAllMocks()
})

describe('GridCell', () => {
  it('renders empty state when no video', () => {
    render(<GridCell position={0} />)
    expect(screen.getByText('Empty')).toBeInTheDocument()
  })

  it('renders main video text when isMainVideo and no src', () => {
    render(<GridCell position={GRID_CENTER} isMainVideo />)
    expect(screen.getByText('Main Video')).toBeInTheDocument()
  })

  it('renders video element when src provided', () => {
    render(<GridCell position={0} videoSrc="/test.mp4" />)
    const video = document.querySelector('video')
    expect(video).toHaveAttribute('src', '/test.mp4')
  })

  it('renders label when provided with video', () => {
    render(<GridCell position={0} videoSrc="/test.mp4" label="Test Label" />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('has correct aria-label for main video', () => {
    render(<GridCell position={GRID_CENTER} isMainVideo />)
    // aria-label is "Main video" (lowercase v)
    const cell = screen.getByText('Main Video').closest('div[aria-label]')
    expect(cell).toHaveAttribute('aria-label', 'Main video')
  })

  it('has correct aria-label for overlay position', () => {
    render(<GridCell position={3} />)
    const cell = screen.getByText('Empty').closest('div[aria-label]')
    expect(cell).toHaveAttribute('aria-label', 'Overlay at position 3')
  })

  it('is draggable when isDraggable is true', () => {
    render(<GridCell position={0} isDraggable />)
    const cell = screen.getByRole('button')
    expect(cell).toHaveAttribute('draggable', 'true')
  })

  it('is not draggable for center position', () => {
    render(<GridCell position={GRID_CENTER} isDraggable isMainVideo />)
    // Center should not be draggable even with isDraggable prop
    const cell = screen.getByText('Main Video').closest('div')
    expect(cell).not.toHaveAttribute('draggable', 'true')
  })

  it('calls onDragStart when dragging starts', () => {
    const onDragStart = vi.fn()
    render(<GridCell position={0} isDraggable onDragStart={onDragStart} />)

    const cell = screen.getByRole('button')
    const mockDataTransfer = {
      setData: vi.fn(),
      effectAllowed: '',
    }
    fireEvent.dragStart(cell, { dataTransfer: mockDataTransfer })

    expect(onDragStart).toHaveBeenCalledWith(0)
  })

  it('calls onDrop when dropped on', () => {
    const onDrop = vi.fn()
    render(<GridCell position={1} isDropTarget onDrop={onDrop} />)

    const cell = screen.getByText('Empty').closest('div[aria-label]')
    expect(cell).toBeDefined()
    fireEvent.drop(cell!)

    expect(onDrop).toHaveBeenCalledWith(1)
  })
})
