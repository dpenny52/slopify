/**
 * Grid Layout for 3x3 video composition
 *
 * Position indices in the grid:
 * [0] [1] [2]
 * [3] [C] [4]
 * [5] [6] [7]
 *
 * Where C is the center position for the main video
 * and 0-7 are positions for overlay videos
 */

export type GridPosition = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export const GRID_CENTER = 'center' as const
export const GRID_SIZE = 3
export const TOTAL_OVERLAY_POSITIONS = 8

// Grid position indices (0-7) mapped to row/col
export const GRID_POSITIONS: {
  position: GridPosition
  row: number
  col: number
}[] = [
  { position: 0, row: 0, col: 0 }, // Top-left
  { position: 1, row: 0, col: 1 }, // Top-center
  { position: 2, row: 0, col: 2 }, // Top-right
  { position: 3, row: 1, col: 0 }, // Middle-left
  // Center (1,1) is reserved for main video
  { position: 4, row: 1, col: 2 }, // Middle-right
  { position: 5, row: 2, col: 0 }, // Bottom-left
  { position: 6, row: 2, col: 1 }, // Bottom-center
  { position: 7, row: 2, col: 2 }, // Bottom-right
]

export interface GridItem {
  id: string
  position: GridPosition
}

export interface GridLayoutState {
  mainVideoSrc: string | null
  overlays: GridItem[]
}

// Get CSS grid area for a position
export function getGridArea(
  position: GridPosition | typeof GRID_CENTER
): string {
  if (position === GRID_CENTER) {
    return '2 / 2 / 3 / 3' // row-start / col-start / row-end / col-end
  }
  const posInfo = GRID_POSITIONS.find((p) => p.position === position)
  if (!posInfo) return ''
  // CSS grid is 1-indexed
  const row = posInfo.row + 1
  const col = posInfo.col + 1
  return `${row} / ${col} / ${row + 1} / ${col + 1}`
}

// Calculate which positions should be visible based on number of overlays
export function getVisiblePositions(overlayCount: number): GridPosition[] {
  if (overlayCount === 0) return []
  if (overlayCount >= 8) return [0, 1, 2, 3, 4, 5, 6, 7]

  // For fewer overlays, distribute them evenly around the center
  // Priority order for best visual balance:
  const priorityOrder: GridPosition[] = [
    1, // Top-center
    6, // Bottom-center
    3, // Middle-left
    4, // Middle-right
    0, // Top-left
    2, // Top-right
    5, // Bottom-left
    7, // Bottom-right
  ]

  return priorityOrder.slice(0, overlayCount)
}
