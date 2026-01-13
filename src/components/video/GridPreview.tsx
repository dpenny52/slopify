import { useState, useCallback, useEffect } from 'react'
import GridCell from './GridCell'
import { useGridLayout } from '@hooks/useGridLayout'
import {
  type GridPosition,
  GRID_CENTER,
  GRID_POSITIONS,
  getVisiblePositions,
} from '@/types/grid'
import type { OverlayVideo } from '@/types/overlay'

interface GridPreviewProps {
  mainVideoSrc?: string
  selectedOverlays: OverlayVideo[]
  onLayoutChange?: (layout: { id: string; position: GridPosition }[]) => void
}

export default function GridPreview({
  mainVideoSrc,
  selectedOverlays,
  onLayoutChange,
}: GridPreviewProps) {
  const { gridItems, setOverlays, swapOverlays, getOverlayAtPosition } =
    useGridLayout()
  const [dragSourcePosition, setDragSourcePosition] =
    useState<GridPosition | null>(null)

  // Update grid when overlays change
  useEffect(() => {
    setOverlays(selectedOverlays)
  }, [selectedOverlays, setOverlays])

  // Notify parent of layout changes
  useEffect(() => {
    onLayoutChange?.(
      gridItems.map((item) => ({ id: item.id, position: item.position }))
    )
  }, [gridItems, onLayoutChange])

  const handleDragStart = useCallback((position: GridPosition) => {
    setDragSourcePosition(position)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDragSourcePosition(null)
  }, [])

  const handleDrop = useCallback(
    (targetPosition: GridPosition) => {
      if (
        dragSourcePosition !== null &&
        dragSourcePosition !== targetPosition
      ) {
        swapOverlays(dragSourcePosition, targetPosition)
      }
      setDragSourcePosition(null)
    },
    [dragSourcePosition, swapOverlays]
  )

  const visiblePositions = getVisiblePositions(selectedOverlays.length)

  // Get overlay video by id
  const getOverlayById = (id: string): OverlayVideo | undefined => {
    return selectedOverlays.find((o) => o.id === id)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-[var(--text-primary)]">
          Preview
        </h3>
        {selectedOverlays.length > 1 && (
          <p className="text-sm text-[var(--text-secondary)]">
            Drag to rearrange
          </p>
        )}
      </div>

      <div
        className="relative aspect-video max-w-xl mx-auto bg-[var(--background-secondary)] rounded-lg overflow-hidden"
        role="region"
        aria-label="Video preview layout"
      >
        {/* Main video takes full area */}
        <GridCell
          position={GRID_CENTER}
          videoSrc={mainVideoSrc}
          isMainVideo
          label="Main Video"
        />

        {/* Render overlay cells as small thumbnails on top */}
        {GRID_POSITIONS.map(({ position }) => {
          const isVisible = visiblePositions.includes(position)
          if (!isVisible) return null

          const gridItem = getOverlayAtPosition(position)
          const overlay = gridItem ? getOverlayById(gridItem.id) : undefined

          return (
            <GridCell
              key={position}
              position={position}
              videoSrc={overlay?.src}
              label={overlay?.name}
              isDraggable={selectedOverlays.length > 1}
              isDropTarget={
                dragSourcePosition !== null &&
                dragSourcePosition !== position &&
                isVisible
              }
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
            />
          )
        })}
      </div>

      {selectedOverlays.length === 0 && (
        <p className="text-sm text-[var(--text-secondary)] text-center">
          Select overlays to see them on the video
        </p>
      )}
    </div>
  )
}
