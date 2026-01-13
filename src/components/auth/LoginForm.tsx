import { useState, FormEvent } from 'react'
import { useAuthActions } from '@convex-dev/auth/react'
import { Button, Input } from '@components/ui'

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToSignup?: () => void
}

function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps) {
  const { signIn } = useAuthActions()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!password) {
      setError('Password is required')
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn('password', {
        email,
        password,
        flow: 'signIn',
      })
      console.log('Sign in result:', result)
      localStorage.setItem('userEmail', email)
      onSuccess?.()
    } catch (err) {
      console.error('Sign in error:', err)
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Your password"
        autoComplete="current-password"
      />

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" isLoading={isLoading} className="w-full">
        Log In
      </Button>

      {onSwitchToSignup && (
        <p className="text-center text-sm text-[var(--text-secondary)]">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-[var(--accent)] hover:underline"
          >
            Sign up
          </button>
        </p>
      )}
    </form>
  )
}

export default LoginForm
