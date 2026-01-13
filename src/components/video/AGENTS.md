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

### OverlayThumbnail

- Displays single overlay video as selectable thumbnail
- Uses checkbox role for accessibility
- Preview-on-hover: plays video when mouse enters
- Shows checkmark when selected
- Supports disabled state for max selection limit

### OverlaySelector

- Grid of OverlayThumbnail components
- Displays selection count (e.g., "3/8 selected")
- Uses `useOverlays` hook for selection state
- Calls `onSelectionChange` callback when selection changes

### GridCell

- Single cell in the 3x3 grid layout
- Can display video with auto-play (muted, looped)
- Supports drag-and-drop for position swapping
- Special styling for main video (center cell)
- Uses CSS grid area for positioning

### GridPreview

- 3x3 grid layout preview
- Center cell for main video
- Outer 8 cells for overlay videos
- Intelligent position distribution for < 8 overlays
- Drag-and-drop to swap overlay positions
- Uses `useGridLayout` hook for state management

## Hooks

### useVideoUpload (`src/hooks/useVideoUpload.ts`)

- Manages video file state (file, metadata, objectUrl)
- Handles validation via `validateVideo()`
- Cleans up object URLs automatically
- Exports: `video`, `isLoading`, `error`, `uploadVideo`, `removeVideo`, `clearError`

### useOverlays (`src/hooks/useOverlays.ts`)

- Manages overlay selection state
- Enforces min (1) and max (8) selection limits
- Exports: `overlays`, `selectedIds`, `selectionCount`, `isSelected`, `canSelect`, `hasMinSelection`, `toggleSelection`, `selectOverlay`, `deselectOverlay`, `clearSelection`, `getSelectedOverlays`

### useGridLayout (`src/hooks/useGridLayout.ts`)

- Manages grid layout state for video compositing
- Assigns positions to overlays using priority-based distribution
- Supports swap operations for drag-and-drop
- Exports: `gridItems`, `visiblePositions`, `setOverlays`, `moveOverlay`, `swapOverlays`, `getOverlayAtPosition`, `clearGrid`

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

### overlay.ts (`src/types/overlay.ts`)

- `OverlayVideo` - id, name, description, src, thumbnailTime
- `OverlaySelection` - id and position in grid
- `SAMPLE_OVERLAYS` - Array of 8 pre-configured overlay videos
- Constants: `MIN_OVERLAY_SELECTION` (1), `MAX_OVERLAY_SELECTION` (8)

### grid.ts (`src/types/grid.ts`)

- `GridPosition` - Type for outer cell positions (0-7)
- `GRID_CENTER` - Constant for center cell
- `GRID_POSITIONS` - Array mapping positions to row/col coordinates
- `GridItem` - Item with id and position
- `getGridArea(position)` - Returns CSS grid-area value
- `getVisiblePositions(count)` - Returns which positions to show for n overlays

## Sample Overlays

- 8 sample overlay videos in `public/sample-overlays/`
- Videos are .gitignored due to size (~1.3GB total)
- Run `scripts/download-overlays.sh` to download
- Source: Mixkit (royalty-free, commercial use allowed)

## Testing Notes

- Mock `useVideoUpload` hook for component tests
- Mock `useOverlays` hook for OverlaySelector tests
- Use `fireEvent.drop` with `dataTransfer.files` for drag-and-drop tests
- Validation functions are pure and easy to unit test
- Video element metadata extraction needs browser APIs (tested via integration)
- Use `fireEvent.click` on checkbox role elements for selection tests
- TypeScript strict mode: use non-null assertion (!) after explicit `expect().toBeDefined()` checks
- Mock `HTMLMediaElement.prototype.play` in tests with video auto-play:
  ```ts
  beforeAll(() => {
    HTMLMediaElement.prototype.play = vi.fn().mockReturnValue(Promise.resolve())
  })
  ```
- Grid functions like `getGridArea` and `getVisiblePositions` are pure and easy to unit test
