export interface VideoMetadata {
  duration: number
  width: number
  height: number
  name: string
  size: number
  type: string
}

export interface VideoFile {
  file: File
  metadata: VideoMetadata
  objectUrl: string
}

export interface VideoValidationError {
  type: 'format' | 'size' | 'duration'
  message: string
}

export type VideoValidationResult =
  | { valid: true; metadata: VideoMetadata }
  | { valid: false; error: VideoValidationError }

export const SUPPORTED_VIDEO_FORMATS = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
] as const
export const MAX_FILE_SIZE_MB = 500
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
export const MAX_DURATION_SECONDS = 5 * 60 // 5 minutes
