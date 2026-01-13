export interface EncoderConfig {
  codec: string
  width: number
  height: number
  bitrate: number
  framerate: number
}

export interface EncodedChunk {
  data: Uint8Array
  timestamp: number
  type: 'key' | 'delta'
}

export class VideoEncoderWrapper {
  private encoder: VideoEncoder | null = null
  private chunks: EncodedChunk[] = []
  private onChunk: ((chunk: EncodedChunk) => void) | null = null
  async initialize(
    config: EncoderConfig,
    onChunk?: (chunk: EncodedChunk) => void
  ): Promise<void> {
    this.chunks = []
    this.onChunk = onChunk ?? null

    return new Promise((resolve, reject) => {
      this.encoder = new VideoEncoder({
        output: (chunk) => {
          const data = new Uint8Array(chunk.byteLength)
          chunk.copyTo(data)

          const encodedChunk: EncodedChunk = {
            data,
            timestamp: chunk.timestamp,
            type: chunk.type,
          }

          this.chunks.push(encodedChunk)
          this.onChunk?.(encodedChunk)
        },
        error: (error) => {
          reject(error)
        },
      })

      this.encoder.configure({
        codec: config.codec,
        width: config.width,
        height: config.height,
        bitrate: config.bitrate,
        framerate: config.framerate,
      })

      resolve()
    })
  }

  async encodeFrame(frame: VideoFrame, keyFrame = false): Promise<void> {
    if (!this.encoder) {
      throw new Error('Encoder not initialized')
    }

    this.encoder.encode(frame, { keyFrame })
  }

  async flush(): Promise<EncodedChunk[]> {
    if (!this.encoder) {
      throw new Error('Encoder not initialized')
    }

    await this.encoder.flush()
    return this.chunks
  }

  getChunks(): EncodedChunk[] {
    return this.chunks
  }

  close(): void {
    if (this.encoder && this.encoder.state !== 'closed') {
      this.encoder.close()
    }
    this.encoder = null
    this.chunks = []
  }
}

// Calculate optimal bitrate based on resolution
export function calculateBitrate(width: number, height: number): number {
  const pixels = width * height

  // Rough bitrate calculation: ~0.15 bits per pixel at 30fps
  const baseBitrate = pixels * 0.15 * 30

  // Clamp between 2 Mbps and 20 Mbps
  return Math.max(2_000_000, Math.min(20_000_000, baseBitrate))
}
