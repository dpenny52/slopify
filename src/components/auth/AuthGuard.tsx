import { ReactNode } from 'react'
import { useConvexAuth } from 'convex/react'

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isLoading, isAuthenticated } = useConvexAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-6 w-6 border-2 border-[var(--accent)] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export default AuthGuard
