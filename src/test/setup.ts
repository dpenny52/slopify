import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock URL methods that don't exist in jsdom
if (typeof URL.createObjectURL === 'undefined') {
  URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url')
}
if (typeof URL.revokeObjectURL === 'undefined') {
  URL.revokeObjectURL = vi.fn()
}
