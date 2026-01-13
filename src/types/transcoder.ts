export interface TranscodeConfig {
  targetCodec: 'h264'
  targetProfile: 'high'
  targetLevel: '4.0'
  maxWidth: number
  maxHeight: number
  videoBitrate: number
  audioBitrate: number
}

export interface TranscodeProgress {
  stage: 'loading-ffmpeg' | 'transcoding' | 'complete' | 'error'
  percentage: number
  message: string
}

export interface TranscodeResult {
  success: true
  file: File
  originalSize: number
  transcodedSize: number
  wasDownscaled: boolean
}

export interface TranscodeError {
  success: false
  error: string
}

export type TranscodeOutcome = TranscodeResult | TranscodeError

export const DEFAULT_TRANSCODE_CONFIG: TranscodeConfig = {
  targetCodec: 'h264',
  targetProfile: 'high',
  targetLevel: '4.0',
  maxWidth: 1920,
  maxHeight: 1080,
  videoBitrate: 5_000_000,
  audioBitrate: 128_000,
}
