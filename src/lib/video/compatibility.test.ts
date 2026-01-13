import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  checkBrowserCompatibility,
  getCompatibilityMessage,
  isCodecSupported,
  getBestCodec,
} from './compatibility'

describe('compatibility', () => {
  describe('checkBrowserCompatibility', () => {
    const originalVideoDecoder = globalThis.VideoDecoder
    const originalVideoEncoder = globalThis.VideoEncoder
    const originalOffscreenCanvas = globalThis.OffscreenCanvas
    const originalWorker = globalThis.Worker

    afterEach(() => {
      // Restore original values
      if (originalVideoDecoder) {
        globalThis.VideoDecoder = originalVideoDecoder
      } else {
        // @ts-expect-error - intentionally deleting for test
        delete globalThis.VideoDecoder
      }
      if (originalVideoEncoder) {
        globalThis.VideoEncoder = originalVideoEncoder
      } else {
        // @ts-expect-error - intentionally deleting for test
        delete globalThis.VideoEncoder
      }
      if (originalOffscreenCanvas) {
        globalThis.OffscreenCanvas = originalOffscreenCanvas
      } else {
        // @ts-expect-error - intentionally deleting for test
        delete globalThis.OffscreenCanvas
      }
      if (originalWorker) {
        globalThis.Worker = originalWorker
      } else {
        // @ts-expect-error - intentionally deleting for test
        delete globalThis.Worker
      }
    })

    it('returns supported=false when VideoDecoder is missing', () => {
      // @ts-expect-error - intentionally deleting for test
      delete globalThis.VideoDecoder

      const result = checkBrowserCompatibility()

      expect(result.supported).toBe(false)
      expect(result.videoDecoder).toBe(false)
      expect(result.missingFeatures).toContain('VideoDecoder')
    })

    it('returns supported=false when VideoEncoder is missing', () => {
      // @ts-expect-error - intentionally deleting for test
      delete globalThis.VideoEncoder

      const result = checkBrowserCompatibility()

      expect(result.supported).toBe(false)
      expect(result.videoEncoder).toBe(false)
      expect(result.missingFeatures).toContain('VideoEncoder')
    })

    it('returns supported=false when OffscreenCanvas is missing', () => {
      // @ts-expect-error - intentionally deleting for test
      delete globalThis.OffscreenCanvas

      const result = checkBrowserCompatibility()

      expect(result.supported).toBe(false)
      expect(result.offscreenCanvas).toBe(false)
      expect(result.missingFeatures).toContain('OffscreenCanvas')
    })

    it('returns supported=false when Worker is missing', () => {
      // @ts-expect-error - intentionally deleting for test
      delete globalThis.Worker

      const result = checkBrowserCompatibility()

      expect(result.supported).toBe(false)
      expect(result.webWorker).toBe(false)
      expect(result.missingFeatures).toContain('Web Workers')
    })

    it('returns multiple missing features when several APIs are missing', () => {
      // @ts-expect-error - intentionally deleting for test
      delete globalThis.VideoDecoder
      // @ts-expect-error - intentionally deleting for test
      delete globalThis.VideoEncoder

      const result = checkBrowserCompatibility()

      expect(result.supported).toBe(false)
      expect(result.missingFeatures).toContain('VideoDecoder')
      expect(result.missingFeatures).toContain('VideoEncoder')
    })
  })

  describe('getCompatibilityMessage', () => {
    it('returns success message when all features are supported', () => {
      const compat = {
        supported: true,
        videoDecoder: true,
        videoEncoder: true,
        offscreenCanvas: true,
        webWorker: true,
        missingFeatures: [],
      }

      expect(getCompatibilityMessage(compat)).toBe(
        'Your browser supports video processing.'
      )
    })

    it('returns error message listing missing features', () => {
      const compat = {
        supported: false,
        videoDecoder: false,
        videoEncoder: false,
        offscreenCanvas: true,
        webWorker: true,
        missingFeatures: ['VideoDecoder', 'VideoEncoder'],
      }

      const message = getCompatibilityMessage(compat)

      expect(message).toContain("doesn't support video processing")
      expect(message).toContain('VideoDecoder')
      expect(message).toContain('VideoEncoder')
      expect(message).toContain('Chrome or Edge')
    })
  })

  describe('isCodecSupported', () => {
    const originalVideoEncoder = globalThis.VideoEncoder

    beforeEach(() => {
      vi.restoreAllMocks()
    })

    afterEach(() => {
      if (originalVideoEncoder) {
        globalThis.VideoEncoder = originalVideoEncoder
      } else {
        // @ts-expect-error - intentionally deleting for test
        delete globalThis.VideoEncoder
      }
    })

    it('returns false when VideoEncoder is not available', async () => {
      // @ts-expect-error - intentionally deleting for test
      delete globalThis.VideoEncoder

      const result = await isCodecSupported('avc1.42E01E')

      expect(result).toBe(false)
    })

    it('returns true when codec is supported', async () => {
      const mockIsConfigSupported = vi
        .fn()
        .mockResolvedValue({ supported: true })
      globalThis.VideoEncoder = {
        isConfigSupported: mockIsConfigSupported,
      } as unknown as typeof VideoEncoder

      const result = await isCodecSupported('avc1.42E01E')

      expect(result).toBe(true)
      expect(mockIsConfigSupported).toHaveBeenCalledWith({
        codec: 'avc1.42E01E',
        width: 1920,
        height: 1080,
      })
    })

    it('returns false when codec is not supported', async () => {
      const mockIsConfigSupported = vi
        .fn()
        .mockResolvedValue({ supported: false })
      globalThis.VideoEncoder = {
        isConfigSupported: mockIsConfigSupported,
      } as unknown as typeof VideoEncoder

      const result = await isCodecSupported('unsupported-codec')

      expect(result).toBe(false)
    })

    it('returns false when isConfigSupported throws', async () => {
      const mockIsConfigSupported = vi
        .fn()
        .mockRejectedValue(new Error('error'))
      globalThis.VideoEncoder = {
        isConfigSupported: mockIsConfigSupported,
      } as unknown as typeof VideoEncoder

      const result = await isCodecSupported('avc1.42E01E')

      expect(result).toBe(false)
    })
  })

  describe('getBestCodec', () => {
    const originalVideoEncoder = globalThis.VideoEncoder

    afterEach(() => {
      if (originalVideoEncoder) {
        globalThis.VideoEncoder = originalVideoEncoder
      } else {
        // @ts-expect-error - intentionally deleting for test
        delete globalThis.VideoEncoder
      }
    })

    it('returns first supported codec from the list', async () => {
      const mockIsConfigSupported = vi.fn().mockImplementation(({ codec }) => {
        // Support only vp8
        return Promise.resolve({ supported: codec === 'vp8' })
      })
      globalThis.VideoEncoder = {
        isConfigSupported: mockIsConfigSupported,
      } as unknown as typeof VideoEncoder

      const result = await getBestCodec()

      expect(result).toBe('vp8')
    })

    it('returns default codec when none are supported', async () => {
      const mockIsConfigSupported = vi
        .fn()
        .mockResolvedValue({ supported: false })
      globalThis.VideoEncoder = {
        isConfigSupported: mockIsConfigSupported,
      } as unknown as typeof VideoEncoder

      const result = await getBestCodec()

      expect(result).toBe('avc1.42E01E')
    })

    it('prefers H.264 baseline over other codecs', async () => {
      const mockIsConfigSupported = vi
        .fn()
        .mockResolvedValue({ supported: true })
      globalThis.VideoEncoder = {
        isConfigSupported: mockIsConfigSupported,
      } as unknown as typeof VideoEncoder

      const result = await getBestCodec()

      expect(result).toBe('avc1.42E01E')
    })
  })
})
