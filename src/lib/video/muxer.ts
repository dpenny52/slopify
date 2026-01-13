import { Muxer, ArrayBufferTarget } from 'mp4-muxer'

export interface MuxerConfig {
  width: number
  height: number
  frameRate: number
  codec: string
}

export class VideoMuxer {
  private muxer: Muxer<ArrayBufferTarget> | null = null

  initialize(config: MuxerConfig): void {
    this.muxer = new Muxer({
      target: new ArrayBufferTarget(),
      video: {
        codec: config.codec.startsWith('avc') ? 'avc' : 'vp9',
        width: config.width,
        height: config.height,
      },
      fastStart: 'in-memory',
    })
  }

  addVideoChunkRaw(
    chunk: EncodedVideoChunk,
    meta?: EncodedVideoChunkMetadata
  ): void {
    if (!this.muxer) {
      throw new Error('Muxer not initialized')
    }

    this.muxer.addVideoChunk(chunk, meta)
  }

  finalize(): ArrayBuffer {
    if (!this.muxer) {
      throw new Error('Muxer not initialized')
    }

    this.muxer.finalize()
    return this.muxer.target.buffer
  }

  close(): void {
    this.muxer = null
  }
}

// Create a downloadable blob from the muxed video
export function createVideoBlob(buffer: ArrayBuffer): Blob {
  return new Blob([buffer], { type: 'video/mp4' })
}

// Download the video
export function downloadVideo(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
