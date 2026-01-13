import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthToken } from '@convex-dev/auth/react'
import { LoginForm, SignupForm } from '@components/auth'
import { Card } from '@components/ui'

function LoginPage() {
  const navigate = useNavigate()
  const token = useAuthToken()
  const isAuthenticated = token !== null
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  // Redirect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/editor')
    }
  }, [isAuthenticated, navigate])

  if (isAuthenticated) {
    return null
  }

  const handleSuccess = () => {
    // Navigation is now handled by useEffect when isAuthenticated changes
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-[var(--text-secondary)] mt-2">
          {mode === 'login'
            ? 'Log in to save and load your projects'
            : 'Sign up to save your video projects'}
        </p>
      </div>

      <Card padding="lg">
        {mode === 'login' ? (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToSignup={() => setMode('signup')}
          />
        ) : (
          <SignupForm
            onSuccess={handleSuccess}
            onSwitchToLogin={() => setMode('login')}
          />
        )}
      </Card>
    </div>
  )
}

export default LoginPage
