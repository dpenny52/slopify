# Agents Learnings - convex/

## Convex Setup

- Schema defined in `schema.ts`
- Has its own `tsconfig.json` (required for Convex)
- Convex generates types in `_generated/` folder (gitignored)

## Schema

Projects table stores:

- `name`: Project name
- `overlayIds`: Array of overlay video IDs
- `positions`: Array of grid positions for overlays
- `createdAt`: Timestamp
- `userId`: Owner ID for data isolation

Index: `by_user` on `userId` for efficient user queries.

## Running Convex

```bash
npx convex dev    # Start dev server (requires auth)
npx convex deploy # Deploy to production
```

## Environment

- `VITE_CONVEX_URL` environment variable required
- Set in `.env.local` (gitignored)
- ConvexProvider wraps app in `main.tsx`

## Security

- All queries must filter by authenticated `userId`
- Use `ctx.auth.getUserIdentity()` in queries/mutations
- Never expose other users' data
