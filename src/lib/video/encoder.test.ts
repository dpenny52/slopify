import { describe, it, expect } from 'vitest'
import { calculateBitrate } from './encoder'

describe('encoder', () => {
  describe('calculateBitrate', () => {
    it('calculates bitrate based on resolution', () => {
      // 1920x1080 = 2,073,600 pixels
      // At 0.15 bits/pixel at 30fps = ~9.3 Mbps
      const bitrate = calculateBitrate(1920, 1080)

      expect(bitrate).toBeGreaterThan(2_000_000)
      expect(bitrate).toBeLessThanOrEqual(20_000_000)
    })

    it('returns minimum bitrate for very small resolutions', () => {
      // 320x240 = 76,800 pixels
      // At 0.15 bits/pixel at 30fps = ~0.35 Mbps, but clamped to 2 Mbps
      const bitrate = calculateBitrate(320, 240)

      expect(bitrate).toBe(2_000_000)
    })

    it('returns maximum bitrate for very large resolutions', () => {
      // 4K: 3840x2160 = 8,294,400 pixels
      // At 0.15 bits/pixel at 30fps = ~37 Mbps, but clamped to 20 Mbps
      const bitrate = calculateBitrate(3840, 2160)

      expect(bitrate).toBe(20_000_000)
    })

    it('scales proportionally for common resolutions', () => {
      const bitrate720p = calculateBitrate(1280, 720)
      const bitrate1080p = calculateBitrate(1920, 1080)

      // 1080p should have higher bitrate than 720p
      expect(bitrate1080p).toBeGreaterThan(bitrate720p)
    })
  })
})
