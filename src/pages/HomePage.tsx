import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-[var(--text-primary)]">
          Slopify
        </h1>
        <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
          Composite your videos with satisfying overlays. Upload a video, select
          overlays, arrange them in a grid, and download your creation.
        </p>
        <Link
          to="/editor"
          className="inline-block px-8 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium rounded-lg transition-colors"
        >
          Get Started
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)]">
          <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
            Upload
          </h3>
          <p className="text-[var(--text-secondary)]">
            Upload your main video in MP4, WebM, or MOV format. Up to 500MB and
            5 minutes.
          </p>
        </div>
        <div className="p-6 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)]">
          <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
            Select Overlays
          </h3>
          <p className="text-[var(--text-secondary)]">
            Choose from 8 sample overlay videos to surround your main video in a
            3x3 grid.
          </p>
        </div>
        <div className="p-6 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)]">
          <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
            Download
          </h3>
          <p className="text-[var(--text-secondary)]">
            Process and download your composited video. All processing happens
            in your browser.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
