import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useOverlays } from './useOverlays'
import { SAMPLE_OVERLAYS, MAX_OVERLAY_SELECTION } from '@/types/overlay'

describe('useOverlays', () => {
  it('returns all sample overlays', () => {
    const { result } = renderHook(() => useOverlays())
    expect(result.current.overlays).toEqual(SAMPLE_OVERLAYS)
  })

  it('starts with no selections', () => {
    const { result } = renderHook(() => useOverlays())
    expect(result.current.selectionCount).toBe(0)
    expect(result.current.selectedIds.size).toBe(0)
  })

  it('can select an overlay', () => {
    const { result } = renderHook(() => useOverlays())

    act(() => {
      result.current.selectOverlay('overlay-1')
    })

    expect(result.current.selectionCount).toBe(1)
    expect(result.current.isSelected('overlay-1')).toBe(true)
  })

  it('can deselect an overlay', () => {
    const { result } = renderHook(() => useOverlays())

    act(() => {
      result.current.selectOverlay('overlay-1')
    })
    expect(result.current.isSelected('overlay-1')).toBe(true)

    act(() => {
      result.current.deselectOverlay('overlay-1')
    })
    expect(result.current.isSelected('overlay-1')).toBe(false)
    expect(result.current.selectionCount).toBe(0)
  })

  it('toggleSelection toggles selection state', () => {
    const { result } = renderHook(() => useOverlays())

    act(() => {
      result.current.toggleSelection('overlay-1')
    })
    expect(result.current.isSelected('overlay-1')).toBe(true)

    act(() => {
      result.current.toggleSelection('overlay-1')
    })
    expect(result.current.isSelected('overlay-1')).toBe(false)
  })

  it('cannot select more than max selection', () => {
    const { result } = renderHook(() => useOverlays())

    // Select max overlays
    act(() => {
      for (let i = 1; i <= MAX_OVERLAY_SELECTION; i++) {
        result.current.selectOverlay(`overlay-${i}`)
      }
    })

    expect(result.current.selectionCount).toBe(MAX_OVERLAY_SELECTION)
    expect(result.current.canSelect).toBe(false)

    // Try to select one more
    act(() => {
      const success = result.current.selectOverlay('overlay-9')
      expect(success).toBe(false)
    })

    expect(result.current.selectionCount).toBe(MAX_OVERLAY_SELECTION)
  })

  it('canSelect is true when under max', () => {
    const { result } = renderHook(() => useOverlays())
    expect(result.current.canSelect).toBe(true)

    act(() => {
      result.current.selectOverlay('overlay-1')
    })
    expect(result.current.canSelect).toBe(true)
  })

  it('hasMinSelection is false with no selection', () => {
    const { result } = renderHook(() => useOverlays())
    expect(result.current.hasMinSelection).toBe(false)
  })

  it('hasMinSelection is true with at least 1 selection', () => {
    const { result } = renderHook(() => useOverlays())

    act(() => {
      result.current.selectOverlay('overlay-1')
    })

    expect(result.current.hasMinSelection).toBe(true)
  })

  it('clearSelection removes all selections', () => {
    const { result } = renderHook(() => useOverlays())

    act(() => {
      result.current.selectOverlay('overlay-1')
      result.current.selectOverlay('overlay-2')
      result.current.selectOverlay('overlay-3')
    })
    expect(result.current.selectionCount).toBe(3)

    act(() => {
      result.current.clearSelection()
    })
    expect(result.current.selectionCount).toBe(0)
  })

  it('getSelectedOverlays returns selected overlay objects', () => {
    const { result } = renderHook(() => useOverlays())

    act(() => {
      result.current.selectOverlay('overlay-1')
      result.current.selectOverlay('overlay-3')
    })

    const selected = result.current.getSelectedOverlays()
    expect(selected).toHaveLength(2)
    expect(selected.map((o) => o.id)).toContain('overlay-1')
    expect(selected.map((o) => o.id)).toContain('overlay-3')
  })
})
