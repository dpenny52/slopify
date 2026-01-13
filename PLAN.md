# Slopify Implementation Plan

## Overview

Slopify is a React web app that lets users upload a video, select 1-8 overlay videos, arrange them in a 3x3 grid around the main video, and download the composited result. All video processing happens client-side using WebCodecs/Canvas API.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Convex (database + auth)
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library
- **Deployment**: Vercel

---

## Feature 1: Project Scaffolding ✅ COMPLETE

### Tasks

- [x] Initialize Vite project with React + TypeScript template
- [x] Install and configure Convex
- [x] Set up Vitest and React Testing Library
- [x] Configure Tailwind CSS
- [x] Create folder structure (components/, hooks/, lib/, pages/, types/, constants/)
- [x] Set up path aliases (@components/_, @hooks/_, @lib/\*)
- [x] Configure React Router
- [x] Set up ESLint with TypeScript and React plugins
- [x] Configure Prettier for code formatting
- [x] Enable TypeScript strict mode in tsconfig.json
- [x] Add pre-commit hooks with Husky + lint-staged
- [x] Create basic App shell with header and main content area
- [x] Create HomePage with "Slopify" branding and "Get Started" button
- [x] Create placeholder EditorPage route
- [x] Add basic Layout component (header with nav, main content area)
- [x] Style with Tailwind for a clean, usable appearance

### Acceptance Criteria

- [x] `npm run dev` starts without errors and shows the app in browser
- [x] App displays homepage with Slopify branding
- [x] Navigation between Home and Editor pages works
- [x] `npm run build` produces production build
- [x] `npm run test` runs test suite
- [x] `npm run lint` passes with no errors
- [x] `npm run typecheck` passes with no errors
- [x] Convex dev server connects successfully
- [x] Pre-commit hooks run lint and typecheck automatically

### Tests

- [x] Smoke test: App component renders
- [x] HomePage renders with branding
- [x] Navigation links work
- [x] Convex client initializes (deployed to content-bird-356.convex.cloud)

---

## Feature 2: UI Component Library ✅ COMPLETE

### Tasks

- [x] Create Button component (primary, secondary, outline, danger variants)
- [x] Create Card component
- [x] Create Modal component
- [x] Create ProgressBar component
- [x] Create Input/Form field components
- [x] Create Toast notification system

### Acceptance Criteria

- [x] All components are accessible (ARIA compliant)
- [x] Components are fully typed with TypeScript
- [x] Consistent styling across components

### Tests

- [x] Each component renders with default props
- [x] Test variants and states (loading, disabled)
- [x] Test click handlers and interactions

---

## Feature 3: Authentication ✅ COMPLETE

**Note:** Auth is optional - users can use the editor without logging in. Login is only required to save/load projects.

### Tasks

- [x] Configure Convex Auth with password provider
- [x] Create user schema (extending authTables)
- [x] Create LoginForm component
- [x] Create SignupForm component
- [x] Create AuthGuard component for project save/load features only
- [x] Implement useAuth hook
- [x] Build login/signup page
- [x] Add logout functionality
- [x] Add "Login to save" prompt for unauthenticated users (AuthGuard fallback)

### Acceptance Criteria

- [x] Users can create accounts with email/password
- [x] Users can log in with valid credentials
- [x] Invalid credentials show error messages
- [x] Auth state persists across page refreshes
- [x] Editor accessible without login
- [x] Save/load features prompt login if unauthenticated (via AuthGuard)

### Tests

- [x] Form validation (empty fields, invalid email)
- [x] Error message display
- [x] AuthGuard redirect behavior

---

## Feature 4: Video Upload and Preview

### Tasks

- [ ] Create VideoUploader component with drag-and-drop
- [ ] Implement file type validation (mp4, webm, mov)
- [ ] Implement file size validation (500MB limit)
- [ ] Implement video duration validation (5 minute max)
- [ ] Create VideoPreview component
- [ ] Implement useVideoUpload hook
- [ ] Extract video metadata (duration, resolution)
- [ ] Add upload progress indicator

### Acceptance Criteria

- [ ] Users can select video via file picker or drag-and-drop
- [ ] Only supported formats accepted
- [ ] Files exceeding size limit (500MB) show error
- [ ] Videos exceeding duration limit (5 min) show error
- [ ] Preview plays uploaded video
- [ ] Users can remove/replace video

### Tests

- File validation with mock File objects
- Drag-and-drop events
- Error states for invalid files

---

## Feature 5: Sample Overlay Selection

### Tasks

- [ ] Download 8 sample overlay video clips from the internet (slime playing videos)
- [ ] Bundle downloaded clips in public/sample-overlays/
- [ ] Create overlay metadata configuration
- [ ] Create OverlayThumbnail component
- [ ] Create OverlaySelector component with grid
- [ ] Implement selection state (1-8 limit)
- [ ] Implement useOverlays hook
- [ ] Add selection count indicator
- [ ] Add preview-on-hover

### Acceptance Criteria

- [ ] 8 sample overlays displayed
- [ ] Users can select by clicking thumbnails
- [ ] Selected overlays visually distinguished
- [ ] Selection count shown (e.g., "3/8 selected")
- [ ] Cannot select more than 8
- [ ] Must select at least 1 to proceed

### Tests

- Selection toggle functionality
- Selection limits (min/max)
- Selection count display

---

## Feature 6: Grid Layout Preview

### Tasks

- [ ] Define grid layout constants (8 outer + 1 center cell)
- [ ] Create GridCell component
- [ ] Create GridPreview component (3x3 grid)
- [ ] Implement useGridLayout hook
- [ ] Allow drag-and-drop rearrangement
- [ ] Show live preview with all videos playing
- [ ] Handle different overlay counts (1-8)

### Acceptance Criteria

- [ ] Grid with center cell for main video
- [ ] Selected overlays populate outer cells (grid adapts to number selected)
- [ ] Empty cells hidden (asymmetric layout when <8 overlays selected)
- [ ] Users can rearrange overlay positions
- [ ] All videos play simultaneously in preview

### Tests

- Grid renders correct number of cells
- Overlay positioning logic
- Drag-and-drop reordering

---

## Feature 7: Video Processing Engine

**Note:** Output resolution matches the main video resolution. Each grid cell is scaled proportionally.

### Tasks

- [ ] Create video decoder module (VideoDecoder API)
- [ ] Create video encoder module (VideoEncoder API)
- [ ] Implement canvas compositor for grid rendering
- [ ] Create frame synchronization logic
- [ ] Implement useVideoProcessor hook with progress
- [ ] Handle different video durations (loop shorter ones)
- [ ] Create Web Worker for non-blocking processing
- [ ] Integrate mp4-muxer for output
- [ ] Handle audio (main video audio only, all overlay videos muted)
- [ ] Implement processing cancellation
- [ ] Add browser compatibility check

### Acceptance Criteria

- [ ] Videos decoded frame-by-frame
- [ ] Frames composited onto canvas in grid layout
- [ ] Composited frames encoded to video
- [ ] Progress accurately reported
- [ ] Processing can be cancelled
- [ ] Output matches preview layout
- [ ] Unsupported browsers show error message

### Tests

- Decoder/encoder modules with mocked WebCodecs
- Canvas rendering snapshot tests
- Progress calculation logic
- Cancellation flow

---

## Feature 8: Video Download

### Tasks

- [ ] Create DownloadButton component
- [ ] Implement blob URL creation
- [ ] Trigger browser download with filename
- [ ] Show file size estimate
- [ ] Clean up blob URLs after download

### Acceptance Criteria

- [ ] Download button appears after processing
- [ ] Click saves MP4 to device
- [ ] File named "slopify-video-[timestamp].mp4"
- [ ] File size shown before download
- [ ] Blob URLs cleaned up

### Tests

- Blob URL creation
- Download trigger mechanism

---

## Feature 9: Project Save/Load

**Note:** Only project configuration is saved (overlay selections, positions, project name). The main video is NOT stored - users must re-upload it when loading a saved project.

### Tasks

- [ ] Define project schema in Convex (name, overlayIds, positions, createdAt)
- [ ] Create saveProject mutation
- [ ] Create getUserProjects query
- [ ] Create deleteProject mutation
- [ ] Create ProjectSaveDialog component
- [ ] Create ProjectList component
- [ ] Create ProjectCard component
- [ ] Implement useProjects hook
- [ ] Add "re-upload video" prompt when loading saved project

### Acceptance Criteria

- [ ] Users can save project with a name
- [ ] Projects persist after logout/login
- [ ] Users see list of saved projects
- [ ] Loading project restores overlay selections and positions
- [ ] Loading project prompts user to re-upload main video
- [ ] Users can delete projects
- [ ] Only authenticated users can save/load

### Tests

- Save dialog validation
- Project list rendering
- Delete confirmation flow

---

## Feature 10: Editor Integration & Polish

### Tasks

- [ ] Create EditorPage with wizard flow (Upload -> Select -> Arrange -> Process -> Download)
- [ ] Add step indicator
- [ ] Implement state persistence during session
- [ ] Add keyboard shortcuts
- [ ] Implement responsive layout
- [ ] Add tooltips and help text
- [ ] Create error boundary

### Acceptance Criteria

- [ ] Users complete full workflow without confusion
- [ ] Step indicator shows progress
- [ ] App usable on tablet-sized screens
- [ ] Errors handled gracefully
- [ ] Loading states provide feedback

### Tests

- End-to-end flow testing
- Step navigation
- Error boundary behavior

---

## Folder Structure

```
slopify/
├── public/
│   └── sample-overlays/           # Bundled sample overlay videos
│       ├── overlay-1.mp4
│       └── ... (8 sample clips)
├── src/
│   ├── components/
│   │   ├── ui/                    # Button, Card, Modal, ProgressBar
│   │   ├── auth/                  # LoginForm, SignupForm, AuthGuard
│   │   ├── video/                 # VideoUploader, VideoPreview, OverlaySelector, GridPreview
│   │   ├── editor/                # EditorCanvas, EditorControls, DownloadButton
│   │   └── projects/              # ProjectList, ProjectCard, ProjectSaveDialog
│   ├── hooks/                     # useAuth, useVideoUpload, useVideoProcessor, useOverlays, useProjects
│   ├── lib/
│   │   ├── video/                 # decoder.ts, encoder.ts, compositor.ts, muxer.ts
│   │   ├── canvas/                # renderer.ts, grid.ts
│   │   └── utils/                 # file.ts, validation.ts
│   ├── pages/                     # HomePage, EditorPage, ProjectsPage, LoginPage
│   ├── types/                     # TypeScript definitions
│   ├── constants/                 # App constants
│   ├── App.tsx
│   └── main.tsx
├── convex/                        # Convex backend
│   ├── schema.ts
│   ├── auth.ts
│   ├── projects.ts
│   └── users.ts
├── tests/
│   ├── components/
│   ├── hooks/
│   └── lib/
├── .husky/                        # Git hooks
│   └── pre-commit
├── eslint.config.js               # ESLint flat config
├── .prettierrc                    # Prettier config
├── tsconfig.json                  # TypeScript config (strict mode)
├── vite.config.ts
├── vitest.config.ts
└── package.json
```

---

## Key Files to Create

| File                                       | Purpose                           |
| ------------------------------------------ | --------------------------------- |
| `src/lib/video/compositor.ts`              | Core grid compositing logic       |
| `src/lib/video/decoder.ts`                 | Video decoding utilities          |
| `src/lib/video/encoder.ts`                 | Video encoding utilities          |
| `src/hooks/useVideoProcessor.ts`           | Processing pipeline orchestration |
| `convex/schema.ts`                         | Database schema                   |
| `convex/auth.ts`                           | Auth configuration                |
| `convex/projects.ts`                       | Project queries/mutations         |
| `src/components/video/GridPreview.tsx`     | 3x3 grid preview                  |
| `src/components/video/OverlaySelector.tsx` | Overlay selection UI              |
| `src/pages/EditorPage.tsx`                 | Main editor workflow              |

---

## Key Libraries

| Library                   | Purpose                         |
| ------------------------- | ------------------------------- |
| convex                    | Database and backend            |
| @convex-dev/auth          | Authentication                  |
| mp4-muxer                 | MP4 muxing for WebCodecs output |
| tailwindcss               | Styling                         |
| react-router-dom          | Routing                         |
| zod                       | Validation                      |
| vitest                    | Testing                         |
| @testing-library/react    | Component testing               |
| eslint                    | Linting                         |
| @typescript-eslint/\*     | TypeScript ESLint plugins       |
| eslint-plugin-react-hooks | React hooks linting rules       |
| prettier                  | Code formatting                 |
| husky                     | Git hooks                       |
| lint-staged               | Run linters on staged files     |

---

## Security Considerations

1. **Authentication**
   - Use Convex Auth's built-in password hashing (bcrypt)
   - Enforce minimum 8 character passwords
   - Rate limit login attempts

2. **Data Isolation**
   - All Convex queries filter by authenticated user ID
   - Use `ctx.auth.getUserIdentity()` in all queries/mutations
   - Never expose other users' projects

3. **File Security**
   - Validate file MIME types client-side
   - Set 500MB file size limit
   - Set 5 minute video duration limit
   - Process videos entirely client-side (no upload to server)

4. **Privacy**
   - User videos never leave their browser
   - No server-side video storage
   - Clear blob URLs after download

---

## Technical Challenges & Mitigations

| Challenge                     | Mitigation                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **WebCodecs browser support** | Detect at runtime with `'VideoDecoder' in window`, show error for unsupported browsers (Safari has limited support) |
| **Memory with large videos**  | Process frames in batches, call `frame.close()` immediately after use, use OffscreenCanvas in Web Workers           |
| **Video synchronization**     | Normalize all videos to 30fps, loop shorter overlay videos to match main video duration                             |
| **Audio handling**            | Use only the main (user-uploaded) video's audio track; all overlay videos (slime clips) are muted in final output   |
| **Processing time**           | Web Workers for non-blocking UI, accurate progress bar, cancellation support                                        |
| **Codec compatibility**       | Use H.264 (AVC) as primary codec, detect supported codecs at runtime                                                |

---

## Verification Plan

### Unit Tests

Run `npm run test` - all tests should pass

### Manual Testing Checklist

1. **Authentication**
   - [ ] Create new account
   - [ ] Log in with valid credentials
   - [ ] See error with invalid credentials
   - [ ] Log out successfully
   - [ ] Auth persists on page refresh

2. **Video Upload**
   - [ ] Upload valid MP4 file
   - [ ] Reject non-video files with error
   - [ ] Reject files over 500MB
   - [ ] Preview plays uploaded video
   - [ ] Can replace uploaded video

3. **Overlay Selection**
   - [ ] See all 8 sample overlays
   - [ ] Select overlays by clicking
   - [ ] See selection count update
   - [ ] Cannot select more than 8
   - [ ] Preview on hover works

4. **Grid Layout**
   - [ ] Main video appears in center
   - [ ] Overlays populate outer cells
   - [ ] Can drag to rearrange
   - [ ] All videos play in preview

5. **Processing**
   - [ ] Progress bar shows during processing
   - [ ] Can cancel processing
   - [ ] Error shown for unsupported browser

6. **Download**
   - [ ] Download button appears after processing
   - [ ] File downloads with correct name
   - [ ] Downloaded video plays correctly

7. **Projects**
   - [ ] Save project with name
   - [ ] See saved projects in list
   - [ ] Load saved project
   - [ ] Delete project

### Browser Testing

- Chrome (primary - full WebCodecs support)
- Firefox (WebCodecs support)
- Safari (limited WebCodecs - show warning)

### In-Browser Tests

Use Claude Chrome extension for E2E workflow verification:

- Complete full upload -> select -> arrange -> process -> download flow
- Verify output video plays correctly
