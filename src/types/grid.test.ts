import { describe, it, expect } from 'vitest'
import {
  getGridArea,
  getVisiblePositions,
  GRID_CENTER,
  GRID_POSITIONS,
} from './grid'

describe('grid types', () => {
  describe('GRID_POSITIONS', () => {
    it('has 8 positions', () => {
      expect(GRID_POSITIONS).toHaveLength(8)
    })

    it('has correct positions 0-7', () => {
      const positions = GRID_POSITIONS.map((p) => p.position)
      expect(positions).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
    })

    it('does not include center position (1,1)', () => {
      const centerPosition = GRID_POSITIONS.find(
        (p) => p.row === 1 && p.col === 1
      )
      expect(centerPosition).toBeUndefined()
    })
  })

  describe('getGridArea', () => {
    it('returns correct area for center', () => {
      expect(getGridArea(GRID_CENTER)).toBe('2 / 2 / 3 / 3')
    })

    it('returns correct area for position 0 (top-left)', () => {
      expect(getGridArea(0)).toBe('1 / 1 / 2 / 2')
    })

    it('returns correct area for position 1 (top-center)', () => {
      expect(getGridArea(1)).toBe('1 / 2 / 2 / 3')
    })

    it('returns correct area for position 2 (top-right)', () => {
      expect(getGridArea(2)).toBe('1 / 3 / 2 / 4')
    })

    it('returns correct area for position 7 (bottom-right)', () => {
      expect(getGridArea(7)).toBe('3 / 3 / 4 / 4')
    })
  })

  describe('getVisiblePositions', () => {
    it('returns empty array for 0 overlays', () => {
      expect(getVisiblePositions(0)).toEqual([])
    })

    it('returns 1 position for 1 overlay', () => {
      const positions = getVisiblePositions(1)
      expect(positions).toHaveLength(1)
    })

    it('returns 4 positions for 4 overlays', () => {
      const positions = getVisiblePositions(4)
      expect(positions).toHaveLength(4)
    })

    it('returns all 8 positions for 8 or more overlays', () => {
      const positions = getVisiblePositions(8)
      expect(positions).toHaveLength(8)
      expect(positions.sort()).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
    })

    it('prioritizes symmetric positions', () => {
      // First position should be top-center (1)
      const onePosition = getVisiblePositions(1)
      expect(onePosition).toContain(1)

      // Two positions should include top and bottom center
      const twoPositions = getVisiblePositions(2)
      expect(twoPositions).toContain(1) // top-center
      expect(twoPositions).toContain(6) // bottom-center
    })
  })
})
