import { type GridPosition, GRID_POSITIONS, GRID_SIZE } from '@/types/grid'

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
 * Compositor handles drawing multiple video frames onto a canvas in a 3x3 grid layout.
 * The center cell contains the main video, and the outer 8 cells contain overlays.
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
   * Calculate the dimensions and position of a cell in the grid
   */
  getCellRect(position: GridPosition | 'center'): {
    x: number
    y: number
    width: number
    height: number
  } {
    const { width, height, cellGap } = this.config
    const cellWidth = (width - cellGap * (GRID_SIZE - 1)) / GRID_SIZE
    const cellHeight = (height - cellGap * (GRID_SIZE - 1)) / GRID_SIZE

    let row: number
    let col: number

    if (position === 'center') {
      row = 1
      col = 1
    } else {
      const posInfo = GRID_POSITIONS.find((p) => p.position === position)
      if (!posInfo) {
        throw new Error(`Invalid position: ${position}`)
      }
      row = posInfo.row
      col = posInfo.col
    }

    return {
      x: col * (cellWidth + cellGap),
      y: row * (cellHeight + cellGap),
      width: cellWidth,
      height: cellHeight,
    }
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
