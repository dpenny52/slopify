import { useState, useCallback } from 'react'
import {
  type GridPosition,
  type GridItem,
  getVisiblePositions,
  TOTAL_OVERLAY_POSITIONS,
} from '@/types/grid'
import type { OverlayVideo } from '@/types/overlay'

interface UseGridLayoutReturn {
  gridItems: GridItem[]
  visiblePositions: GridPosition[]
  setOverlays: (overlays: OverlayVideo[]) => void
  moveOverlay: (fromPosition: GridPosition, toPosition: GridPosition) => void
  swapOverlays: (position1: GridPosition, position2: GridPosition) => void
  getOverlayAtPosition: (position: GridPosition) => GridItem | undefined
  clearGrid: () => void
}

export function useGridLayout(): UseGridLayoutReturn {
  const [gridItems, setGridItems] = useState<GridItem[]>([])

  const visiblePositions = getVisiblePositions(gridItems.length)

  const setOverlays = useCallback((overlays: OverlayVideo[]) => {
    const positions = getVisiblePositions(overlays.length)
    const items: GridItem[] = overlays.map((overlay, index) => ({
      id: overlay.id,
      position: positions[index] ?? (0 as GridPosition),
    }))
    setGridItems(items)
  }, [])

  const getOverlayAtPosition = useCallback(
    (position: GridPosition): GridItem | undefined => {
      return gridItems.find((item) => item.position === position)
    },
    [gridItems]
  )

  const moveOverlay = useCallback(
    (fromPosition: GridPosition, toPosition: GridPosition) => {
      setGridItems((prev) =>
        prev.map((item) => {
          if (item.position === fromPosition) {
            return { ...item, position: toPosition }
          }
          return item
        })
      )
    },
    []
  )

  const swapOverlays = useCallback(
    (position1: GridPosition, position2: GridPosition) => {
      setGridItems((prev) =>
        prev.map((item) => {
          if (item.position === position1) {
            return { ...item, position: position2 }
          }
          if (item.position === position2) {
            return { ...item, position: position1 }
          }
          return item
        })
      )
    },
    []
  )

  const clearGrid = useCallback(() => {
    setGridItems([])
  }, [])

  return {
    gridItems,
    visiblePositions,
    setOverlays,
    moveOverlay,
    swapOverlays,
    getOverlayAtPosition,
    clearGrid,
  }
}

export { TOTAL_OVERLAY_POSITIONS }
