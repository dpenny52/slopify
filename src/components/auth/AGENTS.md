# Agents Learnings - Auth Components

## Architecture

- Uses `@convex-dev/auth` for authentication
- `ConvexAuthProvider` wraps the app in `main.tsx`
- Auth is optional - editor works without login
- Save/load features require authentication via `AuthGuard`

## Components

### LoginForm

- Email/password form with client-side validation
- Uses `useAuthActions().signIn` with flow: 'signIn'
- Supports switch to signup callback

### SignupForm

- Email/password with confirm password
- Client-side validation:
  - Email required and valid format
  - Password minimum 8 characters
  - Password confirmation match
- Uses `useAuthActions().signIn` with flow: 'signUp'

### AuthGuard

- Wraps protected content
- Shows loading spinner during auth check
- Renders fallback when not authenticated
- Renders children when authenticated

## Hooks

### useAuth (`src/hooks/useAuth.ts`)

- Combines `useConvexAuth` and `useAuthActions`
- Exports: `isLoading`, `isAuthenticated`, `signIn`, `signOut`

## Convex Backend

### Schema (`convex/schema.ts`)

- Extends `authTables` from `@convex-dev/auth/server`
- Projects table has `userId` for data isolation

### Auth Config (`convex/auth.ts`)

- Uses Password provider from `@convex-dev/auth/providers/Password`

### HTTP Routes (`convex/http.ts`)

- Adds auth HTTP routes via `auth.addHttpRoutes(http)`

## Testing Notes

- Mock `convex/react` with `useConvexAuth` returning auth state
- Mock `@convex-dev/auth/react` with `useAuthActions` returning mock functions
- Use `fireEvent.submit(form)` for form validation tests

## Layout Integration

- Layout shows Log In/Log Out button based on auth state
- Uses `useConvexAuth` for auth state check
- Uses `useAuthActions().signOut` for logout
