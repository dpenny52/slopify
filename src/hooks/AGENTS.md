# Agents Learnings - src/hooks/

## Available Hooks

### useAuth

- Wraps Convex Auth hooks (useConvexAuth, useAuthActions)
- Returns: isAuthenticated, isLoading, user, signIn, signUp, signOut

### useVideoUpload

- Manages video file upload state
- Validates file format, size, and duration
- Returns: file, videoMetadata, error, isLoading, handleFileSelect, handleDrop, clearVideo

### useOverlays

- Manages overlay video selection (1-8 overlays)
- Returns: selectedOverlays, toggleOverlay, isSelected, selectionCount, canSelect, clearSelection

### useGridLayout

- Manages 3x3 grid layout positions
- Returns: overlays (Map), setOverlays, swapOverlays, getOverlayAtPosition, clearGrid

### useVideoProcessor

- Orchestrates video processing pipeline
- Uses VideoProcessor from lib/video/processor
- Returns: isProcessing, progress, error, outputBlob, processVideos, cancelProcessing, clearOutput, downloadOutput

### useProjects

- Manages Convex project save/load operations
- Uses Convex useQuery and useMutation hooks
- Returns: projects, isLoading, error, saveProject, deleteProject, updateProject, clearError
- Requires user to be authenticated

## Testing Hooks

- Use `renderHook` from @testing-library/react
- Wrap with providers as needed (ConvexProvider for Convex hooks)
- Use `act()` for state updates
- Mock external dependencies (e.g., Convex client)

## Patterns

### Video Processing Hook Usage

```typescript
const { processVideos, progress, outputBlob, downloadOutput } =
  useVideoProcessor()

// Start processing
await processVideos({
  mainVideo: videoElement,
  overlays: [{ position: 0, video: overlayElement }],
  width: 1920,
  height: 1080,
  frameRate: 30,
  duration: 60, // seconds
})

// Check progress
console.log(progress.percentage, progress.stage)

// Download when complete
if (outputBlob) {
  downloadOutput('my-video.mp4')
}
```
