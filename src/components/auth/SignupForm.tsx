import { useState, FormEvent } from 'react'
import { useAuthActions } from '@convex-dev/auth/react'
import { Button, Input } from '@components/ui'

interface SignupFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const { signIn } = useAuthActions()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!password) {
      setError('Password is required')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn('password', {
        email,
        password,
        flow: 'signUp',
      })
      console.log('Sign up result:', result)
      localStorage.setItem('userEmail', email)
      onSuccess?.()
    } catch (err) {
      // Handle specific error types from Convex Auth
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred'

      if (
        errorMessage.includes('already exists') ||
        errorMessage.includes('already in use')
      ) {
        setError('An account with this email already exists.')
      } else if (errorMessage.includes('Invalid')) {
        setError('Invalid email or password format.')
      } else {
        // Log the actual error for debugging
        console.error('Signup error:', errorMessage)
        setError('Could not create account. Please try again.')
      }
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
        placeholder="At least 8 characters"
        autoComplete="new-password"
      />

      <Input
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm your password"
        autoComplete="new-password"
      />

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" isLoading={isLoading} className="w-full">
        Create Account
      </Button>

      {onSwitchToLogin && (
        <p className="text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-[var(--accent)] hover:underline"
          >
            Log in
          </button>
        </p>
      )}
    </form>
  )
}

export default SignupForm
