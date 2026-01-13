import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { createVideoBlob, downloadVideo } from './muxer'

describe('muxer', () => {
  const originalCreateObjectURL = URL.createObjectURL
  const originalRevokeObjectURL = URL.revokeObjectURL

  beforeEach(() => {
    // Stub URL methods that don't exist in jsdom
    URL.createObjectURL = vi.fn().mockReturnValue('blob:test-url')
    URL.revokeObjectURL = vi.fn()
  })

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL
    URL.revokeObjectURL = originalRevokeObjectURL
  })
  describe('createVideoBlob', () => {
    it('creates a blob with video/mp4 type', () => {
      const buffer = new ArrayBuffer(100)

      const blob = createVideoBlob(buffer)

      expect(blob).toBeInstanceOf(Blob)
      expect(blob.type).toBe('video/mp4')
    })

    it('creates blob with correct size', () => {
      const buffer = new ArrayBuffer(1024)

      const blob = createVideoBlob(buffer)

      expect(blob.size).toBe(1024)
    })

    it('handles empty buffer', () => {
      const buffer = new ArrayBuffer(0)

      const blob = createVideoBlob(buffer)

      expect(blob.size).toBe(0)
      expect(blob.type).toBe('video/mp4')
    })
  })

  describe('downloadVideo', () => {
    it('creates a download link and clicks it', () => {
      const mockClick = vi.fn()

      const mockAnchor = {
        href: '',
        download: '',
        click: mockClick,
      }
      vi.spyOn(document, 'createElement').mockReturnValue(
        mockAnchor as unknown as HTMLAnchorElement
      )

      const blob = new Blob(['test'], { type: 'video/mp4' })
      downloadVideo(blob, 'test-video.mp4')

      expect(URL.createObjectURL).toHaveBeenCalledWith(blob)
      expect(mockAnchor.href).toBe('blob:test-url')
      expect(mockAnchor.download).toBe('test-video.mp4')
      expect(mockClick).toHaveBeenCalled()
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url')
    })
  })
})
