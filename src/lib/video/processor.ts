import { VideoCompositor, type GridSource } from './compositor'
import { VideoMuxer, createVideoBlob } from './muxer'
import { type GridPosition } from '@/types/grid'

export interface ProcessorConfig {
  mainVideo: HTMLVideoElement
  overlays: { position: GridPosition; video: HTMLVideoElement }[]
  width: number
  height: number
  frameRate: number
  duration: number
}

export interface ProcessingProgress {
  currentFrame: number
  totalFrames: number
  percentage: number
  stage:
    | 'initializing'
    | 'processing'
    | 'encoding'
    | 'finalizing'
    | 'complete'
    | 'cancelled'
}

export type ProgressCallback = (progress: ProcessingProgress) => void

/**
 * Process videos and composite them into a single output
 */
export class VideoProcessor {
  private compositor: VideoCompositor | null = null
  private muxer: VideoMuxer | null = null
  private cancelled = false
  private encoder: VideoEncoder | null = null

  async process(
    config: ProcessorConfig,
    onProgress?: ProgressCallback
  ): Promise<Blob> {
    this.cancelled = false

    const { width, height, frameRate, duration, mainVideo, overlays } = config
    const totalFrames = Math.ceil(duration * frameRate)

    // Report initialization
    onProgress?.({
      currentFrame: 0,
      totalFrames,
      percentage: 0,
      stage: 'initializing',
    })

    // Initialize compositor
    this.compositor = new VideoCompositor({
      width,
      height,
      cellGap: 4,
    })

    // Initialize muxer
    this.muxer = new VideoMuxer()
    this.muxer.initialize({
      width,
      height,
      frameRate,
      codec: 'avc1.42E01E',
    })

    // Initialize encoder
    const encodedChunks: {
      chunk: EncodedVideoChunk
      meta?: EncodedVideoChunkMetadata
    }[] = []

    this.encoder = new VideoEncoder({
      output: (chunk, meta) => {
        encodedChunks.push({ chunk, meta })
      },
      error: (error) => {
        console.error('Encoder error:', error)
      },
    })

    this.encoder.configure({
      codec: 'avc1.42E01E',
      width,
      height,
      bitrate: 5_000_000,
      framerate: frameRate,
    })

    // Process each frame
    onProgress?.({
      currentFrame: 0,
      totalFrames,
      percentage: 0,
      stage: 'processing',
    })

    const frameDuration = 1 / frameRate
    let processedFrames = 0

    for (let i = 0; i < totalFrames; i++) {
      if (this.cancelled) {
        this.cleanup()
        return createVideoBlob(new ArrayBuffer(0))
      }

      const timestamp = i * frameDuration

      // Seek all videos to current timestamp
      mainVideo.currentTime = timestamp % mainVideo.duration
      for (const { video } of overlays) {
        video.currentTime = timestamp % video.duration
      }

      // Wait a frame for video to update
      await new Promise((resolve) => requestAnimationFrame(resolve))

      // Build sources for compositing
      const sources: GridSource[] = [
        { position: 'center', source: mainVideo },
        ...overlays.map(({ position, video }) => ({
          position,
          source: video,
        })),
      ]

      // Composite frame
      this.compositor.composite(sources)
      const frame = this.compositor.getFrame((i * 1_000_000) / frameRate)

      // Encode frame
      const keyFrame = i % 30 === 0
      this.encoder.encode(frame, { keyFrame })
      frame.close()

      processedFrames++
      onProgress?.({
        currentFrame: processedFrames,
        totalFrames,
        percentage: Math.round((processedFrames / totalFrames) * 100),
        stage: 'processing',
      })
    }

    // Flush encoder
    onProgress?.({
      currentFrame: totalFrames,
      totalFrames,
      percentage: 100,
      stage: 'encoding',
    })

    await this.encoder.flush()
    this.encoder.close()

    // Add all chunks to muxer
    onProgress?.({
      currentFrame: totalFrames,
      totalFrames,
      percentage: 100,
      stage: 'finalizing',
    })

    for (const { chunk, meta } of encodedChunks) {
      this.muxer.addVideoChunkRaw(chunk, meta)
    }

    // Finalize and create blob
    const buffer = this.muxer.finalize()
    const blob = createVideoBlob(buffer)

    onProgress?.({
      currentFrame: totalFrames,
      totalFrames,
      percentage: 100,
      stage: 'complete',
    })

    this.cleanup()
    return blob
  }

  cancel(): void {
    this.cancelled = true
  }

  private cleanup(): void {
    if (this.encoder && this.encoder.state !== 'closed') {
      this.encoder.close()
    }
    this.encoder = null
    this.compositor = null
    this.muxer?.close()
    this.muxer = null
  }
}
