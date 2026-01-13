export interface DecodedFrame {
  frame: VideoFrame
  timestamp: number
}

export interface DecoderConfig {
  codec: string
  width: number
  height: number
}

export class VideoDecoderWrapper {
  private decoder: VideoDecoder | null = null
  private frames: DecodedFrame[] = []
  private resolveFrames: ((frames: DecodedFrame[]) => void) | null = null
  private rejectFrames: ((error: Error) => void) | null = null
  private expectedFrameCount = 0

  async initialize(config: DecoderConfig): Promise<void> {
    this.frames = []

    return new Promise((resolve, reject) => {
      this.decoder = new VideoDecoder({
        output: (frame) => {
          this.frames.push({
            frame,
            timestamp: frame.timestamp ?? 0,
          })

          if (
            this.expectedFrameCount > 0 &&
            this.frames.length >= this.expectedFrameCount &&
            this.resolveFrames
          ) {
            this.resolveFrames(this.frames)
            this.resolveFrames = null
          }
        },
        error: (error) => {
          if (this.rejectFrames) {
            this.rejectFrames(error)
            this.rejectFrames = null
          }
          reject(error)
        },
      })

      this.decoder.configure({
        codec: config.codec,
        codedWidth: config.width,
        codedHeight: config.height,
      })

      resolve()
    })
  }

  async decodeChunk(chunk: EncodedVideoChunk): Promise<void> {
    if (!this.decoder) {
      throw new Error('Decoder not initialized')
    }

    this.decoder.decode(chunk)
  }

  async flush(): Promise<DecodedFrame[]> {
    if (!this.decoder) {
      throw new Error('Decoder not initialized')
    }

    await this.decoder.flush()
    return this.frames
  }

  async waitForFrames(count: number): Promise<DecodedFrame[]> {
    this.expectedFrameCount = count

    if (this.frames.length >= count) {
      return this.frames
    }

    return new Promise((resolve, reject) => {
      this.resolveFrames = resolve
      this.rejectFrames = reject
    })
  }

  getFrames(): DecodedFrame[] {
    return this.frames
  }

  close(): void {
    this.frames.forEach((f) => f.frame.close())
    this.frames = []

    if (this.decoder && this.decoder.state !== 'closed') {
      this.decoder.close()
    }
    this.decoder = null
  }
}

// Extract video info from a video file
export async function extractVideoInfo(
  file: File
): Promise<{ codec: string; width: number; height: number; duration: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true

    const objectUrl = URL.createObjectURL(file)
    video.src = objectUrl

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl)
      resolve({
        codec: 'avc1.42E01E', // Default to H.264 baseline
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
      })
    }

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load video metadata'))
    }
  })
}
