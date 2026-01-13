# Agents Learnings - src/lib/video/

## Module Overview

This directory contains the client-side video processing engine using WebCodecs API.

## Files

- **compatibility.ts** - Browser feature detection (VideoDecoder, VideoEncoder, OffscreenCanvas, Worker)
- **decoder.ts** - VideoDecoder wrapper for decoding video frames
- **encoder.ts** - VideoEncoder wrapper for encoding frames with bitrate calculation
- **compositor.ts** - OffscreenCanvas-based grid compositor for 3x3 layout
- **muxer.ts** - mp4-muxer integration for creating MP4 output
- **processor.ts** - Main processing orchestration (decode → composite → encode → mux)

## Key Patterns

### Browser Compatibility

```typescript
import { checkBrowserCompatibility } from './compatibility'
const compat = checkBrowserCompatibility()
if (!compat.supported) {
  // Show error to user with compat.missingFeatures
}
```

### Video Processing Flow

1. Initialize VideoCompositor with output dimensions
2. Initialize VideoEncoder with codec config
3. For each frame timestamp:
   - Seek all video elements to timestamp
   - Draw sources to compositor canvas using `composite(sources)`
   - Get VideoFrame with `getFrame(timestamp)`
   - Encode frame with `encoder.encode(frame, { keyFrame })`
   - Close frame immediately
4. Flush encoder and add chunks to muxer
5. Finalize muxer to get ArrayBuffer
6. Create blob with `createVideoBlob(buffer)`

### Grid Layout

- Center cell: main video
- Outer 8 cells (GridPosition 0-7): overlay videos
- Use GRID_POSITIONS from `@/types/grid` for row/col mapping

## Testing Notes

- jsdom doesn't support WebCodecs APIs (VideoEncoder, VideoDecoder, OffscreenCanvas, VideoFrame)
- Mock browser APIs in tests using `globalThis` assignment
- URL.createObjectURL/revokeObjectURL must be stubbed in jsdom
- Focus tests on utility functions (calculateBitrate, createVideoBlob, getCompatibilityMessage)

## Dependencies

- **mp4-muxer**: For creating MP4 container from encoded video chunks
- Uses `Muxer` class with `ArrayBufferTarget` for in-memory output

## Codec Selection

- Default codec: `avc1.42E01E` (H.264 Baseline)
- Use `getBestCodec()` to detect best supported codec at runtime
- Supported codecs checked: avc1.42E01E, avc1.4D401E, avc1.640028, vp8, vp09.00.10.08

## Limitations

- Audio handling not yet implemented (deferred)
- Web Worker offloading not yet implemented (main thread processing works)
