import { Link, Outlet, useLocation } from 'react-router-dom'
import { useConvexAuth, useQuery } from 'convex/react'
import { useAuthActions, useAuthToken } from '@convex-dev/auth/react'
import { api } from '../../convex/_generated/api'
import { Button } from '@components/ui'

function Layout() {
  const location = useLocation()
  const convexAuth = useConvexAuth()
  const { signOut } = useAuthActions()
  const token = useAuthToken()
  const isAuthenticated = token !== null
  const user = useQuery(api.users.currentUser)
  // Get email from localStorage (stored during login)
  const storedEmail = localStorage.getItem('userEmail')

  const handleLogout = async () => {
    localStorage.removeItem('userEmail')
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
            {!convexAuth.isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-[var(--text-secondary)]">
                      {storedEmail || user?.email}
                    </span>
                    <Button variant="outline" onClick={handleLogout}>
                      Log Out
                    </Button>
                  </div>
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
