import { Link, Outlet, useLocation } from 'react-router-dom'
import { useConvexAuth } from 'convex/react'
import { useAuthActions } from '@convex-dev/auth/react'
import { Button } from '@components/ui'

function Layout() {
  const location = useLocation()
  const { isLoading, isAuthenticated } = useConvexAuth()
  const { signOut } = useAuthActions()

  const handleLogout = async () => {
    await signOut()
  }

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
          <div className="flex items-center gap-6">
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
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <Button variant="outline" onClick={handleLogout}>
                    Log Out
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button variant="secondary">Log In</Button>
                  </Link>
                )}
              </>
            )}
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
