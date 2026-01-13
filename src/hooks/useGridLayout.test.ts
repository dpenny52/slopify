import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGridLayout } from './useGridLayout'
import type { OverlayVideo } from '@/types/overlay'

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
  {
    id: 'overlay-3',
    name: 'Overlay 3',
    description: 'Test overlay 3',
    src: '/test-3.mp4',
    thumbnailTime: 0,
  },
]

describe('useGridLayout', () => {
  it('starts with empty grid', () => {
    const { result } = renderHook(() => useGridLayout())
    expect(result.current.gridItems).toHaveLength(0)
  })

  it('setOverlays populates the grid', () => {
    const { result } = renderHook(() => useGridLayout())

    act(() => {
      result.current.setOverlays(mockOverlays)
    })

    expect(result.current.gridItems).toHaveLength(3)
  })

  it('assigns positions to overlays', () => {
    const { result } = renderHook(() => useGridLayout())

    act(() => {
      result.current.setOverlays(mockOverlays)
    })

    const positions = result.current.gridItems.map((item) => item.position)
    expect(positions).toHaveLength(3)
    // Each position should be unique
    expect(new Set(positions).size).toBe(3)
  })

  it('getOverlayAtPosition returns correct item', () => {
    const { result } = renderHook(() => useGridLayout())

    act(() => {
      result.current.setOverlays(mockOverlays)
    })

    const firstItem = result.current.gridItems[0]
    if (firstItem) {
      const found = result.current.getOverlayAtPosition(firstItem.position)
      expect(found?.id).toBe(firstItem.id)
    }
  })

  it('swapOverlays swaps two items', () => {
    const { result } = renderHook(() => useGridLayout())

    act(() => {
      result.current.setOverlays(mockOverlays)
    })

    const item1 = result.current.gridItems[0]
    const item2 = result.current.gridItems[1]

    if (item1 && item2) {
      const pos1 = item1.position
      const pos2 = item2.position

      act(() => {
        result.current.swapOverlays(pos1, pos2)
      })

      // After swap, item1 should be at pos2 and item2 at pos1
      const newItem1 = result.current.gridItems.find((i) => i.id === item1.id)
      const newItem2 = result.current.gridItems.find((i) => i.id === item2.id)

      expect(newItem1?.position).toBe(pos2)
      expect(newItem2?.position).toBe(pos1)
    }
  })

  it('clearGrid empties the grid', () => {
    const { result } = renderHook(() => useGridLayout())

    act(() => {
      result.current.setOverlays(mockOverlays)
    })
    expect(result.current.gridItems).toHaveLength(3)

    act(() => {
      result.current.clearGrid()
    })
    expect(result.current.gridItems).toHaveLength(0)
  })

  it('visiblePositions matches overlay count', () => {
    const { result } = renderHook(() => useGridLayout())

    act(() => {
      result.current.setOverlays(mockOverlays)
    })

    expect(result.current.visiblePositions).toHaveLength(3)
  })
})
