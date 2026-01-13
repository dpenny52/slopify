import { useRef, useState } from 'react'
import type { OverlayVideo } from '@/types/overlay'

interface OverlayThumbnailProps {
  overlay: OverlayVideo
  isSelected: boolean
  disabled?: boolean
  onToggle: () => void
}

export default function OverlayThumbnail({
  overlay,
  isSelected,
  disabled = false,
  onToggle,
}: OverlayThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseEnter = () => {
    setIsHovering(true)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked, ignore
      })
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = overlay.thumbnailTime
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!disabled) {
        onToggle()
      }
    }
  }

  return (
    <div
      role="checkbox"
      aria-checked={isSelected}
      aria-label={`${overlay.name}${isSelected ? ' (selected)' : ''}`}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && onToggle()}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative
        aspect-video
        rounded-lg
        overflow-hidden
        cursor-pointer
        transition-all
        ${disabled && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
        ${
          isSelected
            ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--background)]'
            : 'hover:ring-2 hover:ring-[var(--border)]'
        }
      `}
    >
      <video
        ref={videoRef}
        src={overlay.src}
        className="w-full h-full object-cover"
        muted
        playsInline
        preload="metadata"
        onLoadedMetadata={() => {
          if (videoRef.current) {
            videoRef.current.currentTime = overlay.thumbnailTime
          }
        }}
      />

      {/* Hover overlay with play indicator */}
      {isHovering && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
          <div className="bg-black/60 rounded-full p-2">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-[var(--accent)] rounded-full p-1">
          <svg
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Name label */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
        <p className="text-sm text-white font-medium truncate">
          {overlay.name}
        </p>
      </div>
    </div>
  )
}
