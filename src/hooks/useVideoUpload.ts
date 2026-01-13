import { useState, useCallback } from 'react'
import { validateVideo } from '@lib/utils/video-validation'
import type { VideoFile, VideoValidationError } from '@/types/video'

interface UseVideoUploadState {
  video: VideoFile | null
  isLoading: boolean
  error: VideoValidationError | null
}

interface UseVideoUploadReturn extends UseVideoUploadState {
  uploadVideo: (file: File) => Promise<boolean>
  removeVideo: () => void
  clearError: () => void
}

export function useVideoUpload(): UseVideoUploadReturn {
  const [state, setState] = useState<UseVideoUploadState>({
    video: null,
    isLoading: false,
    error: null,
  })

  const uploadVideo = useCallback(async (file: File): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    const result = await validateVideo(file)

    if (!result.valid) {
      setState((prev) => ({ ...prev, isLoading: false, error: result.error }))
      return false
    }

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
      error: null,
    })

    return true
  }, [])

  const removeVideo = useCallback(() => {
    setState((prev) => {
      if (prev.video?.objectUrl) {
        URL.revokeObjectURL(prev.video.objectUrl)
      }
      return { video: null, isLoading: false, error: null }
    })
  }, [])

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    uploadVideo,
    removeVideo,
    clearError,
  }
}
