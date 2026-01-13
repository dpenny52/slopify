import { useRef, useEffect, DragEvent } from 'react'
import { type GridPosition, GRID_CENTER, getGridArea } from '@/types/grid'

interface GridCellProps {
  position: GridPosition | typeof GRID_CENTER
  videoSrc?: string
  label?: string
  isMainVideo?: boolean
  isDraggable?: boolean
  isDropTarget?: boolean
  onDragStart?: (position: GridPosition) => void
  onDragEnd?: () => void
  onDrop?: (targetPosition: GridPosition) => void
}

export default function GridCell({
  position,
  videoSrc,
  label,
  isMainVideo = false,
  isDraggable = false,
  isDropTarget = false,
  onDragStart,
  onDragEnd,
  onDrop,
}: GridCellProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && videoSrc) {
      const playPromise = videoRef.current.play()
      // play() returns undefined in some environments (e.g., jsdom)
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay may be blocked, ignore
        })
      }
    }
  }, [videoSrc])

  const gridArea = getGridArea(position)

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    if (!isDraggable || position === GRID_CENTER) return
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(position))
    onDragStart?.(position as GridPosition)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (!isDropTarget || position === GRID_CENTER) return
    e.preventDefault()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move'
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    if (!isDropTarget || position === GRID_CENTER) return
    e.preventDefault()
    onDrop?.(position as GridPosition)
  }

  const handleDragEnd = () => {
    onDragEnd?.()
  }

  return (
    <div
      className={`
        relative
        bg-[var(--background-secondary)]
        rounded-lg
        overflow-hidden
        aspect-video
        ${isMainVideo ? 'ring-2 ring-[var(--accent)]' : ''}
        ${isDraggable && position !== GRID_CENTER ? 'cursor-grab active:cursor-grabbing' : ''}
        ${isDropTarget ? 'ring-2 ring-dashed ring-[var(--border)]' : ''}
      `}
      style={{ gridArea }}
      draggable={isDraggable && position !== GRID_CENTER}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      role={isDraggable && position !== GRID_CENTER ? 'button' : undefined}
      aria-label={
        label ||
        (isMainVideo ? 'Main video' : `Overlay at position ${position}`)
      }
    >
      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
          {isMainVideo ? (
            <span className="text-sm">Main Video</span>
          ) : (
            <span className="text-xs">Empty</span>
          )}
        </div>
      )}

      {label && videoSrc && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
          <p className="text-xs text-white truncate">{label}</p>
        </div>
      )}
    </div>
  )
}
