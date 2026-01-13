import { useState, useCallback, useRef } from 'react'
import { validateVideo } from '@lib/utils/video-validation'
import { needsTranscoding, transcodeVideo } from '@lib/video/transcoder'
import type { VideoFile, VideoValidationError } from '@/types/video'
import type { TranscodeProgress } from '@/types/transcoder'

interface UseVideoUploadState {
  video: VideoFile | null
  isLoading: boolean
  isTranscoding: boolean
  transcodeProgress: TranscodeProgress | null
  error: VideoValidationError | null
}

interface UseVideoUploadReturn extends UseVideoUploadState {
  uploadVideo: (file: File) => Promise<boolean>
  removeVideo: () => void
  clearError: () => void
  cancelTranscode: () => void
}

export function useVideoUpload(): UseVideoUploadReturn {
  const [state, setState] = useState<UseVideoUploadState>({
    video: null,
    isLoading: false,
    isTranscoding: false,
    transcodeProgress: null,
    error: null,
  })

  const cancelledRef = useRef(false)

  const uploadVideo = useCallback(async (file: File): Promise<boolean> => {
    cancelledRef.current = false
    setState((prev) => ({
      ...prev,
      isLoading: true,
      isTranscoding: false,
      transcodeProgress: null,
      error: null,
    }))

    const result = await validateVideo(file)

    if (result.valid) {
      // Clean up previous video URL if exists
      setState((prev) => {
        if (prev.video?.objectUrl) {
          URL.revokeObjectURL(prev.video.objectUrl)
        }
        return prev
      })

      const objectUrl = URL.createObjectURL(file)
      setState({
        video: { file, metadata: result.metadata, objectUrl },
        isLoading: false,
        isTranscoding: false,
        transcodeProgress: null,
        error: null,
      })
      return true
    }

    // Validation failed - check if it's a codec issue we can fix
    if (result.error.type === 'format') {
      const canTranscode = await needsTranscoding(file)

      if (canTranscode) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isTranscoding: true,
          error: null,
        }))

        const transcodeResult = await transcodeVideo(
          file,
          undefined,
          (progress) => {
            if (cancelledRef.current) return
            setState((prev) => ({
              ...prev,
              transcodeProgress: progress,
            }))
          }
        )

        if (cancelledRef.current) {
          return false
        }

        if (transcodeResult.success) {
          const newResult = await validateVideo(transcodeResult.file)

          if (newResult.valid) {
            const objectUrl = URL.createObjectURL(transcodeResult.file)
            setState({
              video: {
                file: transcodeResult.file,
                metadata: newResult.metadata,
                objectUrl,
              },
              isLoading: false,
              isTranscoding: false,
              transcodeProgress: null,
              error: null,
            })
            return true
          }
        }

        setState((prev) => ({
          ...prev,
          isLoading: false,
          isTranscoding: false,
          transcodeProgress: null,
          error: {
            type: 'format',
            message: 'Could not convert video. Please try a different file.',
          },
        }))
        return false
      }
    }

    // Non-recoverable error
    setState((prev) => ({
      ...prev,
      isLoading: false,
      isTranscoding: false,
      transcodeProgress: null,
      error: result.error,
    }))
    return false
  }, [])

  const removeVideo = useCallback(() => {
    setState((prev) => {
      if (prev.video?.objectUrl) {
        URL.revokeObjectURL(prev.video.objectUrl)
      }
      return {
        video: null,
        isLoading: false,
        isTranscoding: false,
        transcodeProgress: null,
        error: null,
      }
    })
  }, [])

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  const cancelTranscode = useCallback(() => {
    cancelledRef.current = true
    setState((prev) => ({
      ...prev,
      isLoading: false,
      isTranscoding: false,
      transcodeProgress: null,
      error: { type: 'format', message: 'Conversion cancelled.' },
    }))
  }, [])

  return {
    ...state,
    uploadVideo,
    removeVideo,
    clearError,
    cancelTranscode,
  }
}
