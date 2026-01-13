import { useState, useCallback, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { downloadVideo } from '@/lib/video/muxer'
import { formatFileSize, generateVideoFilename } from '@/lib/utils/format'

interface DownloadButtonProps {
  blob: Blob | null
  disabled?: boolean
  className?: string
}

export default function DownloadButton({
  blob,
  disabled = false,
  className = '',
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  // Create blob URL when blob changes
  useEffect(() => {
    if (blob) {
      const url = URL.createObjectURL(blob)
      setBlobUrl(url)

      // Cleanup on unmount or when blob changes
      return () => {
        URL.revokeObjectURL(url)
        setBlobUrl(null)
      }
    }
  }, [blob])

  const handleDownload = useCallback(() => {
    if (!blob) return

    setIsDownloading(true)

    try {
      const filename = generateVideoFilename()
      downloadVideo(blob, filename)
    } finally {
      // Small delay to show downloading state
      setTimeout(() => {
        setIsDownloading(false)
      }, 500)
    }
  }, [blob])

  if (!blob) {
    return null
  }

  const fileSize = formatFileSize(blob.size)

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <Button
        variant="primary"
        onClick={handleDownload}
        disabled={disabled || isDownloading || !blobUrl}
        isLoading={isDownloading}
        className="min-w-[200px]"
      >
        {isDownloading ? 'Downloading...' : 'Download Video'}
      </Button>
      <span className="text-sm text-[var(--text-secondary)]">
        MP4 ({fileSize})
      </span>
    </div>
  )
}
