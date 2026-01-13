import {
  SUPPORTED_VIDEO_FORMATS,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  MAX_DURATION_SECONDS,
  type VideoMetadata,
  type VideoValidationResult,
} from '@/types/video'

export function validateFileFormat(file: File): string | null {
  if (
    !SUPPORTED_VIDEO_FORMATS.includes(
      file.type as (typeof SUPPORTED_VIDEO_FORMATS)[number]
    )
  ) {
    return `Unsupported format. Please use MP4, WebM, or MOV files.`
  }
  return null
}

export function validateFileSize(file: File): string | null {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`
  }
  return null
}

export function validateDuration(duration: number): string | null {
  if (duration > MAX_DURATION_SECONDS) {
    const maxMinutes = Math.floor(MAX_DURATION_SECONDS / 60)
    return `Video too long. Maximum duration is ${maxMinutes} minutes.`
  }
  return null
}

export function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'

    const objectUrl = URL.createObjectURL(file)
    video.src = objectUrl

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl)
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        name: file.name,
        size: file.size,
        type: file.type,
      })
    }

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load video metadata'))
    }
  })
}

export async function validateVideo(
  file: File
): Promise<VideoValidationResult> {
  // Check format first
  const formatError = validateFileFormat(file)
  if (formatError) {
    return { valid: false, error: { type: 'format', message: formatError } }
  }

  // Check size
  const sizeError = validateFileSize(file)
  if (sizeError) {
    return { valid: false, error: { type: 'size', message: sizeError } }
  }

  // Extract metadata and check duration
  try {
    const metadata = await extractVideoMetadata(file)
    const durationError = validateDuration(metadata.duration)
    if (durationError) {
      return {
        valid: false,
        error: { type: 'duration', message: durationError },
      }
    }

    return { valid: true, metadata }
  } catch {
    return {
      valid: false,
      error: { type: 'format', message: 'Failed to read video file.' },
    }
  }
}
