import { type GridPosition, GRID_POSITIONS } from '@/types/grid'

// Overlay size as fraction of the canvas (1/4 = 0.25)
const OVERLAY_SIZE_FRACTION = 0.25
// Margin from edges as fraction of canvas (0 = touch edges)
const OVERLAY_MARGIN_FRACTION = 0

export interface CompositorConfig {
  width: number
  height: number
  cellGap: number
}

export interface GridSource {
  position: GridPosition | 'center'
  source: CanvasImageSource
}

/**
 * Compositor handles drawing multiple video frames onto a canvas.
 * The main video fills the entire frame, and overlay videos are small
 * thumbnails positioned around the edges on top of the main video.
 */
export class VideoCompositor {
  private canvas: OffscreenCanvas
  private ctx: OffscreenCanvasRenderingContext2D
  private config: CompositorConfig

  constructor(config: CompositorConfig) {
    this.config = config
    this.canvas = new OffscreenCanvas(config.width, config.height)

    const ctx = this.canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Failed to get canvas context')
    }
    this.ctx = ctx
  }

  /**
   * Calculate the dimensions and position of a cell.
   * Center position gets the full canvas.
   * Overlay positions get small thumbnails around the edges.
   */
  getCellRect(position: GridPosition | 'center'): {
    x: number
    y: number
    width: number
    height: number
  } {
    const { width, height } = this.config

    // Center/main video takes full canvas
    if (position === 'center') {
      return { x: 0, y: 0, width, height }
    }

    // Overlay videos are small thumbnails
    const overlayWidth = Math.round(width * OVERLAY_SIZE_FRACTION)
    const overlayHeight = Math.round(height * OVERLAY_SIZE_FRACTION)
    const margin = Math.round(Math.min(width, height) * OVERLAY_MARGIN_FRACTION)

    const posInfo = GRID_POSITIONS.find((p) => p.position === position)
    if (!posInfo) {
      throw new Error(`Invalid position: ${position}`)
    }

    // Calculate x position based on column (0=left, 1=center, 2=right)
    let x: number
    if (posInfo.col === 0) {
      x = margin
    } else if (posInfo.col === 1) {
      x = Math.round((width - overlayWidth) / 2)
    } else {
      x = width - overlayWidth - margin
    }

    // Calculate y position based on row (0=top, 1=middle, 2=bottom)
    let y: number
    if (posInfo.row === 0) {
      y = margin
    } else if (posInfo.row === 1) {
      y = Math.round((height - overlayHeight) / 2)
    } else {
      y = height - overlayHeight - margin
    }

    return { x, y, width: overlayWidth, height: overlayHeight }
  }

  /**
   * Clear the canvas with a background color
   */
  clear(color = '#000000'): void {
    this.ctx.fillStyle = color
    this.ctx.fillRect(0, 0, this.config.width, this.config.height)
  }

  /**
   * Draw a source (video frame or image) at a specific grid position
   */
  drawSource(
    source: CanvasImageSource,
    position: GridPosition | 'center'
  ): void {
    const rect = this.getCellRect(position)

    // Draw with object-fit: cover behavior
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.rect(rect.x, rect.y, rect.width, rect.height)
    this.ctx.clip()

    // Get source dimensions
    let srcWidth: number
    let srcHeight: number

    if (source instanceof VideoFrame) {
      srcWidth = source.displayWidth
      srcHeight = source.displayHeight
    } else if (source instanceof HTMLVideoElement) {
      srcWidth = source.videoWidth
      srcHeight = source.videoHeight
    } else if (source instanceof HTMLImageElement) {
      srcWidth = source.naturalWidth
      srcHeight = source.naturalHeight
    } else {
      // For other image sources, try to get dimensions
      srcWidth = (source as HTMLCanvasElement).width || rect.width
      srcHeight = (source as HTMLCanvasElement).height || rect.height
    }

    // Calculate cover dimensions
    const srcRatio = srcWidth / srcHeight
    const destRatio = rect.width / rect.height

    let drawWidth: number
    let drawHeight: number
    let offsetX: number
    let offsetY: number

    if (srcRatio > destRatio) {
      // Source is wider - fit height, crop width
      drawHeight = rect.height
      drawWidth = rect.height * srcRatio
      offsetX = rect.x - (drawWidth - rect.width) / 2
      offsetY = rect.y
    } else {
      // Source is taller - fit width, crop height
      drawWidth = rect.width
      drawHeight = rect.width / srcRatio
      offsetX = rect.x
      offsetY = rect.y - (drawHeight - rect.height) / 2
    }

    this.ctx.drawImage(source, offsetX, offsetY, drawWidth, drawHeight)
    this.ctx.restore()
  }

  /**
   * Composite multiple sources onto the canvas
   */
  composite(sources: GridSource[]): void {
    this.clear()

    for (const { position, source } of sources) {
      this.drawSource(source, position)
    }
  }

  /**
   * Get the composited frame as a VideoFrame
   */
  getFrame(timestamp: number): VideoFrame {
    return new VideoFrame(this.canvas, {
      timestamp,
      alpha: 'discard',
    })
  }

  /**
   * Get canvas dimensions
   */
  getDimensions(): { width: number; height: number } {
    return {
      width: this.config.width,
      height: this.config.height,
    }
  }
}
