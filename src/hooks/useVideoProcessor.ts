import { useState, useCallback, useRef } from 'react'
import {
  VideoProcessor,
  type ProcessorConfig,
  type ProcessingProgress,
} from '@lib/video/processor'
import {
  checkBrowserCompatibility,
  getCompatibilityMessage,
  type BrowserCompatibility,
} from '@lib/video/compatibility'
import { type GridPosition } from '@/types/grid'

interface VideoSource {
  src: string
  position?: GridPosition
}

interface UseVideoProcessorState {
  isProcessing: boolean
  progress: ProcessingProgress | null
  error: string | null
  outputBlob: Blob | null
  browserCompatibility: BrowserCompatibility
}

interface UseVideoProcessorReturn extends UseVideoProcessorState {
  processVideos: (
    mainVideoSrc: string,
    overlaySources: VideoSource[],
    options?: { width?: number; height?: number; frameRate?: number }
  ) => Promise<Blob | null>
  cancelProcessing: () => void
  clearOutput: () => void
  downloadOutput: (filename?: string) => void
}

export function useVideoProcessor(): UseVideoProcessorReturn {
  const processorRef = useRef<VideoProcessor | null>(null)
  const [state, setState] = useState<UseVideoProcessorState>({
    isProcessing: false,
    progress: null,
    error: null,
    outputBlob: null,
    browserCompatibility: checkBrowserCompatibility(),
  })

  const processVideos = useCallback(
    async (
      mainVideoSrc: string,
      overlaySources: VideoSource[],
      options?: { width?: number; height?: number; frameRate?: number }
    ): Promise<Blob | null> => {
      // Check browser compatibility
      const compat = checkBrowserCompatibility()
      if (!compat.supported) {
        setState((prev) => ({
          ...prev,
          error: getCompatibilityMessage(compat),
        }))
        return null
      }

      setState((prev) => ({
        ...prev,
        isProcessing: true,
        progress: null,
        error: null,
        outputBlob: null,
      }))

      try {
        // Create video elements for main video and overlays
        const mainVideo = document.createElement('video')
        mainVideo.src = mainVideoSrc
        mainVideo.muted = true
        mainVideo.playsInline = true
        await new Promise<void>((resolve, reject) => {
          mainVideo.onloadedmetadata = () => resolve()
          mainVideo.onerror = () =>
            reject(new Error('Failed to load main video'))
        })

        const overlayVideos: {
          position: GridPosition
          video: HTMLVideoElement
        }[] = []

        for (const source of overlaySources) {
          if (source.position === undefined) continue

          const video = document.createElement('video')
          video.src = source.src
          video.muted = true
          video.playsInline = true
          video.loop = true

          await new Promise<void>((resolve, reject) => {
            video.onloadedmetadata = () => resolve()
            video.onerror = () =>
              reject(new Error('Failed to load overlay video'))
          })

          overlayVideos.push({ position: source.position, video })
        }

        const config: ProcessorConfig = {
          mainVideo,
          overlays: overlayVideos,
          width: options?.width ?? mainVideo.videoWidth,
          height: options?.height ?? mainVideo.videoHeight,
          frameRate: options?.frameRate ?? 30,
          duration: mainVideo.duration,
        }

        processorRef.current = new VideoProcessor()

        const blob = await processorRef.current.process(config, (progress) => {
          setState((prev) => ({ ...prev, progress }))
        })

        if (blob.size > 0) {
          setState((prev) => ({
            ...prev,
            isProcessing: false,
            outputBlob: blob,
            progress: {
              currentFrame: config.duration * config.frameRate,
              totalFrames: config.duration * config.frameRate,
              percentage: 100,
              stage: 'complete',
            },
          }))
          return blob
        }

        // Processing was cancelled
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          progress: {
            currentFrame: 0,
            totalFrames: 0,
            percentage: 0,
            stage: 'cancelled',
          },
        }))
        return null
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Processing failed'
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          error: message,
        }))
        return null
      } finally {
        processorRef.current = null
      }
    },
    []
  )

  const cancelProcessing = useCallback(() => {
    processorRef.current?.cancel()
  }, [])

  const clearOutput = useCallback(() => {
    if (state.outputBlob) {
      URL.revokeObjectURL(URL.createObjectURL(state.outputBlob))
    }
    setState((prev) => ({
      ...prev,
      outputBlob: null,
      progress: null,
      error: null,
    }))
  }, [state.outputBlob])

  const downloadOutput = useCallback(
    (filename?: string) => {
      if (!state.outputBlob) return

      const url = URL.createObjectURL(state.outputBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename ?? `slopify-video-${Date.now()}.mp4`
      a.click()
      URL.revokeObjectURL(url)
    },
    [state.outputBlob]
  )

  return {
    ...state,
    processVideos,
    cancelProcessing,
    clearOutput,
    downloadOutput,
  }
}
