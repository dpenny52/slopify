import { useRef, useEffect, DragEvent, CSSProperties } from 'react'
import {
  type GridPosition,
  GRID_CENTER,
  getOverlayPosition,
} from '@/types/grid'

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

  // Build style based on position type
  let style: CSSProperties
  if (isMainVideo) {
    // Main video takes full area
    style = {
      position: 'absolute',
      inset: 0,
      zIndex: 0,
    }
  } else {
    // Overlays use absolute positioning on top of main video
    const overlayPos = getOverlayPosition(position as GridPosition)
    style = {
      position: 'absolute',
      zIndex: 10,
      ...overlayPos,
    }
  }

  return (
    <div
      className={`
        bg-[var(--background-secondary)]
        rounded-lg
        overflow-hidden
        ${isMainVideo ? '' : 'shadow-lg ring-1 ring-black/20'}
        ${isDraggable && position !== GRID_CENTER ? 'cursor-grab active:cursor-grabbing' : ''}
        ${isDropTarget ? 'ring-2 ring-dashed ring-[var(--border)]' : ''}
      `}
      style={style}
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

      {label && videoSrc && !isMainVideo && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5">
          <p className="text-[10px] text-white truncate">{label}</p>
        </div>
      )}
    </div>
  )
}
