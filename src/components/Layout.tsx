import { Link, Outlet, useLocation } from 'react-router-dom'

function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
        <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
          >
            Slopify
          </Link>
          <div className="flex gap-6">
            <Link
              to="/"
              className={`text-sm transition-colors ${
                location.pathname === '/'
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/editor"
              className={`text-sm transition-colors ${
                location.pathname === '/editor'
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Editor
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
