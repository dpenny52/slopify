# Agents Learnings - src/components/editor/

## Components

### DownloadButton

- Displays download button for processed video blob
- Shows file size (formatted with formatFileSize utility)
- Generates timestamped filename (slopify-video-YYYY-MM-DDTHH-MM-SS.mp4)
- Manages blob URL lifecycle (create on mount, revoke on unmount)
- Uses downloadVideo utility from lib/video/muxer

## Usage

```tsx
import DownloadButton from '@/components/editor/DownloadButton'

// Only renders when blob is provided
;<DownloadButton blob={outputBlob} disabled={isProcessing} />
```

## Dependencies

- Uses Button component from ui/
- Uses downloadVideo from lib/video/muxer
- Uses formatFileSize and generateVideoFilename from lib/utils/format

## Testing Notes

- URL.createObjectURL and URL.revokeObjectURL are mocked globally in test/setup.ts
- Mock downloadVideo with vi.mock('@/lib/video/muxer')
