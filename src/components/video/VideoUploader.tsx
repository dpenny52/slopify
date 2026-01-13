import { useRef, useState, DragEvent } from 'react'
import { Button } from '@components/ui'
import VideoPreview from './VideoPreview'
import { useVideoUpload } from '@hooks/useVideoUpload'
import {
  SUPPORTED_VIDEO_FORMATS,
  MAX_FILE_SIZE_MB,
  MAX_DURATION_SECONDS,
} from '@/types/video'

interface VideoUploaderProps {
  onVideoChange?: (file: File | null) => void
}

export default function VideoUploader({ onVideoChange }: VideoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const { video, isLoading, error, uploadVideo, removeVideo, clearError } =
    useVideoUpload()

  const handleFileSelect = async (file: File) => {
    const success = await uploadVideo(file)
    if (success) {
      onVideoChange?.(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemove = () => {
    removeVideo()
    onVideoChange?.(null)
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const maxMinutes = Math.floor(MAX_DURATION_SECONDS / 60)

  if (video) {
    return (
      <VideoPreview
        src={video.objectUrl}
        metadata={video.metadata}
        onRemove={handleRemove}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload video"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleBrowseClick()
          }
        }}
        className={`
          relative
          flex flex-col items-center justify-center
          p-8
          border-2 border-dashed rounded-lg
          cursor-pointer
          transition-colors
          ${
            isDragOver
              ? 'border-[var(--accent)] bg-[var(--accent)]/10'
              : 'border-[var(--border)] hover:border-[var(--text-secondary)]'
          }
          ${isLoading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={SUPPORTED_VIDEO_FORMATS.join(',')}
          onChange={handleInputChange}
          className="hidden"
          aria-hidden="true"
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <svg
              className="animate-spin h-10 w-10 text-[var(--accent)]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-[var(--text-secondary)]">
              Processing video...
            </span>
          </div>
        ) : (
          <>
            <svg
              className="w-12 h-12 text-[var(--text-secondary)] mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p className="text-lg font-medium text-[var(--text-primary)] mb-1">
              {isDragOver ? 'Drop video here' : 'Drag and drop your video'}
            </p>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              or click to browse
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={(e) => e.stopPropagation()}
            >
              Browse Files
            </Button>
          </>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center justify-between p-3 bg-red-900/30 border border-red-600/50 rounded-lg text-red-400"
        >
          <span>{error.message}</span>
          <button
            onClick={clearError}
            className="text-red-400 hover:text-red-300"
            aria-label="Dismiss error"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      <p className="text-xs text-[var(--text-secondary)] text-center">
        Supported formats: MP4, WebM, MOV &middot; Max size: {MAX_FILE_SIZE_MB}
        MB &middot; Max duration: {maxMinutes} minutes
      </p>
    </div>
  )
}
