import { describe, it, expect } from 'vitest'
import {
  validateFileFormat,
  validateFileSize,
  validateDuration,
} from './video-validation'
import { MAX_FILE_SIZE_BYTES, MAX_DURATION_SECONDS } from '@/types/video'

function createMockFile(type: string): File {
  return new File([''], 'test-video.mp4', { type })
}

describe('video-validation', () => {
  describe('validateFileFormat', () => {
    it('accepts mp4 format', () => {
      const file = createMockFile('video/mp4')
      expect(validateFileFormat(file)).toBeNull()
    })

    it('accepts webm format', () => {
      const file = createMockFile('video/webm')
      expect(validateFileFormat(file)).toBeNull()
    })

    it('accepts quicktime (mov) format', () => {
      const file = createMockFile('video/quicktime')
      expect(validateFileFormat(file)).toBeNull()
    })

    it('rejects unsupported formats', () => {
      const file = createMockFile('video/avi')
      expect(validateFileFormat(file)).toContain('Unsupported format')
    })

    it('rejects non-video files', () => {
      const file = createMockFile('image/jpeg')
      expect(validateFileFormat(file)).toContain('Unsupported format')
    })
  })

  describe('validateFileSize', () => {
    it('accepts files under the limit', () => {
      const file = { size: 100 * 1024 * 1024 } as File // 100MB
      expect(validateFileSize(file)).toBeNull()
    })

    it('accepts files at exactly the limit', () => {
      const file = { size: MAX_FILE_SIZE_BYTES } as File
      expect(validateFileSize(file)).toBeNull()
    })

    it('rejects files over the limit', () => {
      const file = { size: MAX_FILE_SIZE_BYTES + 1 } as File
      expect(validateFileSize(file)).toContain('File too large')
    })
  })

  describe('validateDuration', () => {
    it('accepts videos under the limit', () => {
      expect(validateDuration(60)).toBeNull() // 1 minute
    })

    it('accepts videos at exactly the limit', () => {
      expect(validateDuration(MAX_DURATION_SECONDS)).toBeNull()
    })

    it('rejects videos over the limit', () => {
      expect(validateDuration(MAX_DURATION_SECONDS + 1)).toContain(
        'Video too long'
      )
    })
  })
})
