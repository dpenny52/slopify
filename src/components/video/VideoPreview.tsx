import { useRef, useState } from 'react'
import { Button } from '@components/ui'
import type { VideoMetadata } from '@/types/video'

interface VideoPreviewProps {
  src: string
  metadata: VideoMetadata
  onRemove?: () => void
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatFileSize(bytes: number): string {
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(1)} MB`
}

export default function VideoPreview({
  src,
  metadata,
  onRemove,
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleVideoEnd = () => {
    setIsPlaying(false)
  }

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          onEnded={handleVideoEnd}
          playsInline
        />
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity focus:opacity-100"
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? (
            <svg
              className="w-16 h-16 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg
              className="w-16 h-16 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-[var(--text-secondary)]">
          <p className="font-medium text-[var(--text-primary)] truncate max-w-[200px]">
            {metadata.name}
          </p>
          <p>
            {metadata.width}x{metadata.height} &middot;{' '}
            {formatDuration(metadata.duration)} &middot;{' '}
            {formatFileSize(metadata.size)}
          </p>
        </div>

        {onRemove && (
          <Button variant="outline" onClick={onRemove}>
            Remove
          </Button>
        )}
      </div>
    </div>
  )
}
