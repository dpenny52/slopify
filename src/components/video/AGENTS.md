# Agents Learnings - Video Components

## Architecture

- All video processing happens client-side (no server uploads)
- Videos are stored as object URLs created from File objects
- Clean up object URLs with `URL.revokeObjectURL()` when done

## Components

### VideoUploader

- Drag-and-drop zone with click-to-browse fallback
- Validates files before accepting:
  - Format: MP4, WebM, MOV only
  - Size: Max 500MB
  - Duration: Max 5 minutes
- Shows VideoPreview after successful upload
- Uses `useVideoUpload` hook for state management

### VideoPreview

- Displays video with play/pause controls
- Shows metadata: filename, resolution, duration, file size
- Optional remove button via `onRemove` prop

## Hooks

### useVideoUpload (`src/hooks/useVideoUpload.ts`)

- Manages video file state (file, metadata, objectUrl)
- Handles validation via `validateVideo()`
- Cleans up object URLs automatically
- Exports: `video`, `isLoading`, `error`, `uploadVideo`, `removeVideo`, `clearError`

## Validation Utilities

### video-validation.ts (`src/lib/utils/video-validation.ts`)

- `validateFileFormat(file)` - Checks MIME type
- `validateFileSize(file)` - Checks against 500MB limit
- `validateDuration(duration)` - Checks against 5 minute limit
- `extractVideoMetadata(file)` - Creates video element to extract metadata
- `validateVideo(file)` - Runs all validations, returns result with metadata or error

## Types

### video.ts (`src/types/video.ts`)

- `VideoMetadata` - Duration, dimensions, name, size, type
- `VideoFile` - File + metadata + objectUrl
- `VideoValidationError` - Error type and message
- `VideoValidationResult` - Union of valid/invalid results
- Constants: `SUPPORTED_VIDEO_FORMATS`, `MAX_FILE_SIZE_MB`, `MAX_DURATION_SECONDS`

## Testing Notes

- Mock `useVideoUpload` hook for component tests
- Use `fireEvent.drop` with `dataTransfer.files` for drag-and-drop tests
- Validation functions are pure and easy to unit test
- Video element metadata extraction needs browser APIs (tested via integration)
