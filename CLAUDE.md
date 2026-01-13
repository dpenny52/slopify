# Slopify

React + TypeScript + Vite app with Convex backend for video compositing.

## Commands

```bash
npm run dev          # Start Vite dev server
npm run test         # Run Vitest tests
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler check
npm run build        # Production build
```

## Pre-Commit Requirements

Run before every commit:
- `npm run lint`
- `npm run typecheck`
- `npm run test`

## Code Rules

1. **No `any` types** - Use proper TypeScript types. Define interfaces in `src/types/`.

2. **Components return early on error states** - Handle loading/error states at the top of components before the main render.

3. **Hooks in `src/hooks/`, utilities in `src/lib/`** - Keep business logic out of components.

4. **Test public behavior, not implementation** - Tests should verify what users see and do, not internal state.

5. **Validate at boundaries only** - Validate user input and external data; trust internal code.
