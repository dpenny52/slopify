# Slopify

A browser-based video compositing tool that lets you overlay satisfying videos on top of your main video content. Upload a video, select from sample overlays, arrange them in a grid layout, and download your composited creation—all processed locally in your browser.

## Features

- **Video Upload**: Support for MP4, WebM, and MOV formats (up to 500MB, 5 minutes)
- **Overlay Selection**: Choose from 8 sample overlay videos (slime, ice cream, clay, etc.)
- **Grid Layout**: Position overlays in up to 8 positions around the edges of your video
- **Drag & Drop Arrangement**: Rearrange overlay positions by dragging
- **Browser-Based Processing**: All video compositing happens locally using WebCodecs API
- **Automatic Transcoding**: Incompatible video formats are automatically transcoded using FFmpeg.wasm
- **Project Save/Load**: Save your projects to the cloud with Convex backend
- **User Authentication**: Sign up and log in to save your work

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Convex (real-time database and authentication)
- **Video Processing**: WebCodecs API, mp4-muxer, FFmpeg.wasm
- **Routing**: React Router
- **Testing**: Vitest, React Testing Library
- **Build**: Vite

## Prerequisites

- Node.js 18+
- npm or yarn
- A Convex account (for backend features)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/dpenny52/slopify.git
   cd slopify
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Convex** (optional, for cloud features)

   ```bash
   npx convex dev
   ```

   Follow the prompts to create a new Convex project or link to an existing one.

4. **Start the development server**

   ```bash
   npm run dev
   ```

   This starts both the Vite dev server and Convex dev server concurrently.

5. **Open the app**
   Navigate to `http://localhost:5173` in your browser.

## Available Scripts

| Command              | Description                       |
| -------------------- | --------------------------------- |
| `npm run dev`        | Start Vite and Convex dev servers |
| `npm run dev:vite`   | Start only the Vite dev server    |
| `npm run dev:convex` | Start only the Convex dev server  |
| `npm run build`      | Build for production              |
| `npm run preview`    | Preview production build          |
| `npm run test`       | Run tests with Vitest             |
| `npm run lint`       | Run ESLint                        |
| `npm run typecheck`  | Run TypeScript type checking      |

## Browser Compatibility

Slopify requires a modern browser with WebCodecs API support:

- Chrome 94+
- Edge 94+
- Opera 80+

Safari and Firefox are not currently supported due to limited WebCodecs support.

## How It Works

1. **Upload**: Select your main video file
2. **Select**: Choose 1-8 overlay videos from the sample library
3. **Arrange**: Preview the layout and drag overlays to rearrange their positions
4. **Process**: Click "Create Video" to composite the videos together
5. **Download**: Save your finished video

The video processing pipeline:

- Seeks through each frame of the main video
- Draws the main video as the background
- Overlays selected videos at their grid positions (25% size, positioned at corners/edges)
- Encodes each composited frame using WebCodecs VideoEncoder
- Muxes the encoded chunks into an MP4 file using mp4-muxer

## License

MIT
