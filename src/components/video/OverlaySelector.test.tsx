import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import OverlaySelector from './OverlaySelector'
import {
  SAMPLE_OVERLAYS,
  MAX_OVERLAY_SELECTION,
  type OverlayVideo,
} from '@/types/overlay'

// Mock useOverlays hook
const mockToggleSelection = vi.fn()
const mockGetSelectedOverlays = vi.fn((): OverlayVideo[] => [])

let mockSelectionCount = 0
let mockSelectedIds = new Set<string>()

vi.mock('@hooks/useOverlays', () => ({
  useOverlays: () => ({
    overlays: SAMPLE_OVERLAYS,
    selectionCount: mockSelectionCount,
    maxSelection: MAX_OVERLAY_SELECTION,
    isSelected: (id: string) => mockSelectedIds.has(id),
    canSelect: mockSelectionCount < MAX_OVERLAY_SELECTION,
    toggleSelection: mockToggleSelection,
    getSelectedOverlays: mockGetSelectedOverlays,
  }),
}))

describe('OverlaySelector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSelectionCount = 0
    mockSelectedIds = new Set()
  })

  it('renders all sample overlays', () => {
    render(<OverlaySelector />)
    SAMPLE_OVERLAYS.forEach((overlay) => {
      expect(screen.getByText(overlay.name)).toBeInTheDocument()
    })
  })

  it('displays selection count', () => {
    render(<OverlaySelector />)
    expect(
      screen.getByText(`0/${MAX_OVERLAY_SELECTION} selected`)
    ).toBeInTheDocument()
  })

  it('shows "Select Overlays" heading', () => {
    render(<OverlaySelector />)
    expect(screen.getByText('Select Overlays')).toBeInTheDocument()
  })

  it('shows help text when no selection', () => {
    render(<OverlaySelector />)
    expect(screen.getByText(/select at least 1 overlay/i)).toBeInTheDocument()
  })

  it('has group role for overlay grid', () => {
    render(<OverlaySelector />)
    expect(screen.getByRole('group')).toHaveAttribute(
      'aria-label',
      'Overlay video selection'
    )
  })

  it('calls toggleSelection when overlay is clicked', () => {
    render(<OverlaySelector />)

    const checkboxes = screen.getAllByRole('checkbox')
    const firstCheckbox = checkboxes[0]
    expect(firstCheckbox).toBeDefined()
    fireEvent.click(firstCheckbox!)

    expect(mockToggleSelection).toHaveBeenCalledWith('overlay-1')
  })

  it('calls onSelectionChange when selection changes', () => {
    vi.useFakeTimers()
    const onSelectionChange = vi.fn()
    const firstOverlay = SAMPLE_OVERLAYS[0]
    expect(firstOverlay).toBeDefined()
    mockGetSelectedOverlays.mockReturnValue([firstOverlay!])

    render(<OverlaySelector onSelectionChange={onSelectionChange} />)

    const checkboxes = screen.getAllByRole('checkbox')
    const firstCheckbox = checkboxes[0]
    expect(firstCheckbox).toBeDefined()
    fireEvent.click(firstCheckbox!)

    vi.runAllTimers()

    expect(onSelectionChange).toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('renders 8 overlay thumbnails', () => {
    render(<OverlaySelector />)
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(8)
  })
})

describe('OverlaySelector with selections', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSelectionCount = 3
    mockSelectedIds = new Set(['overlay-1', 'overlay-2', 'overlay-3'])
  })

  it('does not show help text when there are selections', () => {
    render(<OverlaySelector />)
    expect(
      screen.queryByText(/select at least 1 overlay/i)
    ).not.toBeInTheDocument()
  })
})
