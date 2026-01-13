import { useState, useCallback } from 'react'
import {
  SAMPLE_OVERLAYS,
  MIN_OVERLAY_SELECTION,
  MAX_OVERLAY_SELECTION,
  type OverlayVideo,
} from '@/types/overlay'

interface UseOverlaysReturn {
  overlays: OverlayVideo[]
  selectedIds: Set<string>
  selectionCount: number
  minSelection: number
  maxSelection: number
  isSelected: (id: string) => boolean
  canSelect: boolean
  hasMinSelection: boolean
  toggleSelection: (id: string) => void
  selectOverlay: (id: string) => boolean
  deselectOverlay: (id: string) => void
  clearSelection: () => void
  getSelectedOverlays: () => OverlayVideo[]
}

export function useOverlays(): UseOverlaysReturn {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const selectionCount = selectedIds.size
  const canSelect = selectionCount < MAX_OVERLAY_SELECTION
  const hasMinSelection = selectionCount >= MIN_OVERLAY_SELECTION

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  )

  const selectOverlay = useCallback(
    (id: string): boolean => {
      if (selectedIds.size >= MAX_OVERLAY_SELECTION) {
        return false
      }
      setSelectedIds((prev) => new Set([...prev, id]))
      return true
    },
    [selectedIds.size]
  )

  const deselectOverlay = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const toggleSelection = useCallback(
    (id: string) => {
      if (selectedIds.has(id)) {
        deselectOverlay(id)
      } else {
        selectOverlay(id)
      }
    },
    [selectedIds, selectOverlay, deselectOverlay]
  )

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const getSelectedOverlays = useCallback((): OverlayVideo[] => {
    return SAMPLE_OVERLAYS.filter((overlay) => selectedIds.has(overlay.id))
  }, [selectedIds])

  return {
    overlays: SAMPLE_OVERLAYS,
    selectedIds,
    selectionCount,
    minSelection: MIN_OVERLAY_SELECTION,
    maxSelection: MAX_OVERLAY_SELECTION,
    isSelected,
    canSelect,
    hasMinSelection,
    toggleSelection,
    selectOverlay,
    deselectOverlay,
    clearSelection,
    getSelectedOverlays,
  }
}
