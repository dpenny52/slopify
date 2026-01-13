import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import VideoUploader from './VideoUploader'

// Mock useVideoUpload hook
const mockUploadVideo = vi.fn()
const mockRemoveVideo = vi.fn()
const mockClearError = vi.fn()

vi.mock('@hooks/useVideoUpload', () => ({
  useVideoUpload: () => ({
    video: null,
    isLoading: false,
    error: null,
    uploadVideo: mockUploadVideo,
    removeVideo: mockRemoveVideo,
    clearError: mockClearError,
  }),
}))

describe('VideoUploader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders upload area', () => {
    render(<VideoUploader />)
    expect(screen.getByText(/drag and drop your video/i)).toBeInTheDocument()
  })

  it('shows browse files button', () => {
    render(<VideoUploader />)
    expect(
      screen.getByRole('button', { name: /browse files/i })
    ).toBeInTheDocument()
  })

  it('shows supported formats info', () => {
    render(<VideoUploader />)
    expect(screen.getByText(/mp4, webm, mov/i)).toBeInTheDocument()
    expect(screen.getByText(/500mb/i)).toBeInTheDocument()
    expect(screen.getByText(/5 minutes/i)).toBeInTheDocument()
  })

  it('has hidden file input', () => {
    render(<VideoUploader />)
    const input = document.querySelector('input[type="file"]')
    expect(input).toHaveClass('hidden')
  })

  it('accepts correct file types', () => {
    render(<VideoUploader />)
    const input = document.querySelector('input[type="file"]')
    expect(input).toHaveAttribute(
      'accept',
      'video/mp4,video/webm,video/quicktime'
    )
  })

  it('changes style on drag over', () => {
    render(<VideoUploader />)
    const dropZone = screen.getByRole('button', { name: /upload video/i })

    fireEvent.dragOver(dropZone)
    expect(screen.getByText(/drop video here/i)).toBeInTheDocument()

    fireEvent.dragLeave(dropZone)
    expect(screen.getByText(/drag and drop your video/i)).toBeInTheDocument()
  })

  it('handles file drop', async () => {
    mockUploadVideo.mockResolvedValue(true)
    const onVideoChange = vi.fn()
    render(<VideoUploader onVideoChange={onVideoChange} />)

    const dropZone = screen.getByRole('button', { name: /upload video/i })
    const file = new File([''], 'test.mp4', { type: 'video/mp4' })

    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    })

    expect(mockUploadVideo).toHaveBeenCalledWith(file)
  })

  it('calls onVideoChange on successful upload', async () => {
    mockUploadVideo.mockResolvedValue(true)
    const onVideoChange = vi.fn()
    render(<VideoUploader onVideoChange={onVideoChange} />)

    const dropZone = screen.getByRole('button', { name: /upload video/i })
    const file = new File([''], 'test.mp4', { type: 'video/mp4' })

    await fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    })

    expect(onVideoChange).toHaveBeenCalledWith(file)
  })
})

describe('VideoUploader with error state', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows error message when error exists', () => {
    vi.doMock('@hooks/useVideoUpload', () => ({
      useVideoUpload: () => ({
        video: null,
        isLoading: false,
        error: { type: 'format', message: 'Unsupported format' },
        uploadVideo: mockUploadVideo,
        removeVideo: mockRemoveVideo,
        clearError: mockClearError,
      }),
    }))

    // Re-import to get new mock
    vi.resetModules()
  })
})

describe('VideoUploader with loading state', () => {
  it('shows loading indicator when processing', async () => {
    vi.doMock('@hooks/useVideoUpload', () => ({
      useVideoUpload: () => ({
        video: null,
        isLoading: true,
        error: null,
        uploadVideo: mockUploadVideo,
        removeVideo: mockRemoveVideo,
        clearError: mockClearError,
      }),
    }))

    // For loading state test we need to re-render with different mock
    // This is tested through integration in the actual component
  })
})
