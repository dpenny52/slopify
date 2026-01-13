import { useState, useCallback, useEffect } from 'react'
import { Button, ProgressBar } from '@/components/ui'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import VideoUploader from '@/components/video/VideoUploader'
import OverlaySelector from '@/components/video/OverlaySelector'
import GridPreview from '@/components/video/GridPreview'
import DownloadButton from '@/components/editor/DownloadButton'
import StepIndicator from '@/components/editor/StepIndicator'
import { useVideoProcessor } from '@/hooks/useVideoProcessor'
import { checkBrowserCompatibility, getCompatibilityMessage } from '@/lib/video'
import type { OverlayVideo } from '@/types/overlay'
import type { GridPosition } from '@/types/grid'

const STEPS = [
  { id: 'upload', label: 'Upload' },
  { id: 'select', label: 'Select' },
  { id: 'arrange', label: 'Arrange' },
  { id: 'process', label: 'Process' },
  { id: 'download', label: 'Download' },
]

interface GridLayout {
  id: string
  position: GridPosition
}

function EditorPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [mainVideoFile, setMainVideoFile] = useState<File | null>(null)
  const [mainVideoUrl, setMainVideoUrl] = useState<string | null>(null)
  const [selectedOverlays, setSelectedOverlays] = useState<OverlayVideo[]>([])
  const [gridLayout, setGridLayout] = useState<GridLayout[]>([])
  const [compatError, setCompatError] = useState<string | null>(null)

  const {
    isProcessing,
    progress,
    error: processingError,
    outputBlob,
    processVideos,
    cancelProcessing,
    clearOutput,
  } = useVideoProcessor()

  // Check browser compatibility on mount
  useEffect(() => {
    const compat = checkBrowserCompatibility()
    if (!compat.supported) {
      setCompatError(getCompatibilityMessage(compat))
    }
  }, [])

  // Create object URL for main video
  useEffect(() => {
    if (mainVideoFile) {
      const url = URL.createObjectURL(mainVideoFile)
      setMainVideoUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setMainVideoUrl(null)
    }
  }, [mainVideoFile])

  // Auto-advance when blob is ready
  useEffect(() => {
    if (outputBlob && currentStep === 3) {
      setCurrentStep(4)
    }
  }, [outputBlob, currentStep])

  const handleVideoChange = useCallback((file: File | null) => {
    setMainVideoFile(file)
    if (file) {
      setCurrentStep(1)
    }
  }, [])

  const handleOverlaySelection = useCallback((overlays: OverlayVideo[]) => {
    setSelectedOverlays(overlays)
  }, [])

  const handleLayoutChange = useCallback((layout: GridLayout[]) => {
    setGridLayout(layout)
  }, [])

  const handleStepClick = useCallback(
    (stepIndex: number) => {
      // Only allow going back to completed steps
      if (stepIndex < currentStep) {
        setCurrentStep(stepIndex)
        // Clear output when going back
        if (stepIndex < 4) {
          clearOutput()
        }
      }
    },
    [currentStep, clearOutput]
  )

  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }, [currentStep])

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      if (currentStep === 4) {
        clearOutput()
      }
    }
  }, [currentStep, clearOutput])

  const handleProcess = useCallback(async () => {
    if (!mainVideoUrl) return

    // Create overlay sources for the processor
    const overlaySources = gridLayout
      .map((item) => {
        const overlay = selectedOverlays.find((o) => o.id === item.id)
        if (!overlay) return null
        return { src: overlay.src, position: item.position }
      })
      .filter((s): s is { src: string; position: GridPosition } => s !== null)

    await processVideos(mainVideoUrl, overlaySources)
  }, [mainVideoUrl, gridLayout, selectedOverlays, processVideos])

  const handleCancel = useCallback(() => {
    cancelProcessing()
  }, [cancelProcessing])

  const handleStartOver = useCallback(() => {
    setCurrentStep(0)
    setMainVideoFile(null)
    setMainVideoUrl(null)
    setSelectedOverlays([])
    setGridLayout([])
    clearOutput()
  }, [clearOutput])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (e.key === 'Escape' && isProcessing) {
        handleCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isProcessing, handleCancel])

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!mainVideoFile
      case 1:
        return selectedOverlays.length > 0
      case 2:
        return gridLayout.length > 0
      case 3:
        return !!outputBlob
      default:
        return false
    }
  }

  if (compatError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-6 text-center">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-red-400 mb-2">
            Browser Not Supported
          </h2>
          <p className="text-red-300">{compatError}</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-[var(--text-primary)] text-center">
          Create Your Video
        </h1>

        <div className="mb-8">
          <StepIndicator
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
        </div>

        <div className="bg-[var(--background-secondary)] rounded-lg border border-[var(--border)] p-6">
          {/* Step 0: Upload */}
          {currentStep === 0 && (
            <div className="max-w-xl mx-auto">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 text-center">
                Upload Your Main Video
              </h2>
              <VideoUploader onVideoChange={handleVideoChange} />
            </div>
          )}

          {/* Step 1: Select Overlays */}
          {currentStep === 1 && (
            <div>
              <OverlaySelector onSelectionChange={handleOverlaySelection} />
            </div>
          )}

          {/* Step 2: Arrange */}
          {currentStep === 2 && (
            <div>
              <GridPreview
                mainVideoSrc={mainVideoUrl || undefined}
                selectedOverlays={selectedOverlays}
                onLayoutChange={handleLayoutChange}
              />
            </div>
          )}

          {/* Step 3: Process */}
          {currentStep === 3 && (
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                {isProcessing ? 'Processing Your Video' : 'Ready to Process'}
              </h2>

              {isProcessing && progress ? (
                <div className="space-y-4">
                  <ProgressBar
                    progress={progress.percentage}
                    showLabel
                    size="lg"
                  />
                  <p className="text-[var(--text-secondary)] capitalize">
                    {progress.stage.replace('_', ' ')}...
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Frame {progress.currentFrame} of {progress.totalFrames}
                  </p>
                  <Button variant="danger" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Press Escape to cancel
                  </p>
                </div>
              ) : isProcessing ? (
                <div className="space-y-4">
                  <p className="text-[var(--text-secondary)]">
                    Initializing...
                  </p>
                  <Button variant="danger" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-[var(--text-secondary)]">
                    Your video is ready to be processed. This may take a few
                    minutes depending on the length of your video.
                  </p>
                  <Button variant="primary" onClick={handleProcess}>
                    Start Processing
                  </Button>
                </div>
              )}

              {processingError && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-600/50 rounded-lg text-red-400">
                  {processingError}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Download */}
          {currentStep === 4 && (
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                Your Video is Ready!
              </h2>
              <p className="text-[var(--text-secondary)] mb-6">
                Your composited video has been created. Click below to download.
              </p>
              <DownloadButton blob={outputBlob} />
              <div className="mt-6">
                <Button variant="secondary" onClick={handleStartOver}>
                  Create Another Video
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {currentStep > 0 && currentStep < 4 && !isProcessing && (
          <div className="flex justify-between mt-6">
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
            {currentStep < 3 && (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Next
              </Button>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}

export default EditorPage
