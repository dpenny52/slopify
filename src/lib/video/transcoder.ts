import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import type {
  TranscodeConfig,
  TranscodeProgress,
  TranscodeOutcome,
} from '@/types/transcoder'
import { DEFAULT_TRANSCODE_CONFIG } from '@/types/transcoder'

let ffmpegInstance: FFmpeg | null = null
let loadPromise: Promise<FFmpeg> | null = null
let ffmpegLogs: string[] = []

export type ProgressCallback = (progress: TranscodeProgress) => void

/**
 * Load FFmpeg.wasm core (lazy, cached)
 */
async function loadFFmpeg(onProgress?: ProgressCallback): Promise<FFmpeg> {
  if (ffmpegInstance?.loaded) {
    return ffmpegInstance
  }

  if (loadPromise) {
    return loadPromise
  }

  onProgress?.({
    stage: 'loading-ffmpeg',
    percentage: 0,
    message: 'Downloading video converter...',
  })

  ffmpegInstance = new FFmpeg()

  ffmpegInstance.on('log', ({ message }) => {
    ffmpegLogs.push(message)
  })

  loadPromise = (async () => {
    try {
      await ffmpegInstance!.load()

      onProgress?.({
        stage: 'loading-ffmpeg',
        percentage: 100,
        message: 'Video converter ready',
      })

      return ffmpegInstance!
    } catch {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'

      await ffmpegInstance!.load({
        coreURL: `${baseURL}/ffmpeg-core.js`,
        wasmURL: `${baseURL}/ffmpeg-core.wasm`,
      })

      onProgress?.({
        stage: 'loading-ffmpeg',
        percentage: 100,
        message: 'Video converter ready',
      })

      return ffmpegInstance!
    }
  })()

  return loadPromise
}

/**
 * Check if a file needs transcoding by attempting browser decode
 */
export function needsTranscoding(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    const url = URL.createObjectURL(file)
    video.src = url

    const cleanup = () => URL.revokeObjectURL(url)

    video.onloadedmetadata = () => {
      cleanup()
      resolve(false)
    }

    video.onerror = () => {
      cleanup()
      resolve(true)
    }

    setTimeout(() => {
      cleanup()
      resolve(true)
    }, 5000)
  })
}

function getExtension(filename: string): string {
  const match = filename.match(/\.[^.]+$/)
  return match ? match[0] : '.mp4'
}

/**
 * Transcode video to browser-compatible format
 */
export async function transcodeVideo(
  file: File,
  config: TranscodeConfig = DEFAULT_TRANSCODE_CONFIG,
  onProgress?: ProgressCallback
): Promise<TranscodeOutcome> {
  ffmpegLogs = []

  try {
    const ffmpeg = await loadFFmpeg(onProgress)

    onProgress?.({
      stage: 'transcoding',
      percentage: 0,
      message: 'Starting conversion...',
    })

    const inputFileName = 'input' + getExtension(file.name)
    const outputFileName = 'output.mp4'

    const fileData = await fetchFile(file)
    await ffmpeg.writeFile(inputFileName, fileData)

    ffmpeg.on('progress', ({ progress }) => {
      const pct = Math.round(progress * 100)
      onProgress?.({
        stage: 'transcoding',
        percentage: pct,
        message: `Converting: ${pct}%`,
      })
    })

    const ffmpegArgs = [
      '-i',
      inputFileName,
      '-c:v',
      'libx264',
      '-preset',
      'ultrafast',
      '-crf',
      '28',
      '-pix_fmt',
      'yuv420p',
      '-vf',
      `scale=${config.maxWidth}:-2`,
      '-an',
      '-y',
      outputFileName,
    ]

    const exitCode = await ffmpeg.exec(ffmpegArgs)

    if (exitCode !== 0) {
      const errorLogs = ffmpegLogs.filter(
        (log) =>
          log.toLowerCase().includes('error') ||
          log.toLowerCase().includes('invalid') ||
          log.toLowerCase().includes('failed')
      )
      throw new Error(
        `FFmpeg failed: ${errorLogs.join('; ') || 'Unknown error'}`
      )
    }

    const files = await ffmpeg.listDir('/')
    const outputExists = files.some((f) => f.name === outputFileName)
    if (!outputExists) {
      throw new Error('FFmpeg did not produce output file')
    }

    const outputData = await ffmpeg.readFile(outputFileName)

    if (outputData.length === 0) {
      throw new Error('FFmpeg produced empty output')
    }

    await ffmpeg.deleteFile(inputFileName)
    await ffmpeg.deleteFile(outputFileName)

    const outputBlob = new Blob([outputData], { type: 'video/mp4' })
    const outputFile = new File(
      [outputBlob],
      file.name.replace(/\.[^.]+$/, '_converted.mp4'),
      { type: 'video/mp4' }
    )

    onProgress?.({
      stage: 'complete',
      percentage: 100,
      message: 'Conversion complete',
    })

    return {
      success: true,
      file: outputFile,
      originalSize: file.size,
      transcodedSize: outputFile.size,
      wasDownscaled: true,
    }
  } catch (error) {
    console.error('[Transcoder] Error:', error)

    const message =
      error instanceof Error ? error.message : 'Transcoding failed'

    onProgress?.({
      stage: 'error',
      percentage: 0,
      message,
    })

    return {
      success: false,
      error: message,
    }
  }
}

/**
 * Check if FFmpeg is already loaded
 */
export function isFFmpegLoaded(): boolean {
  return ffmpegInstance?.loaded ?? false
}
