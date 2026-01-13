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
- Use `auth.getUserId(ctx)` in queries/mutations (from auth.ts)
- Never expose other users' data

## Projects API (projects.ts)

### Mutations

- `saveProject` - Create new project (requires auth)
- `deleteProject` - Delete project by ID (requires auth, validates ownership)
- `updateProject` - Update existing project (requires auth, validates ownership)

### Queries

- `getUserProjects` - Get all projects for current user, ordered by createdAt desc
- `getProject` - Get single project by ID (validates ownership)

## Frontend Usage

```typescript
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

// Query projects
const projects = useQuery(api.projects.getUserProjects)

// Save project
const saveProject = useMutation(api.projects.saveProject)
await saveProject({ name, overlayIds, positions })

// Delete project
const deleteProject = useMutation(api.projects.deleteProject)
await deleteProject({ id })
```
