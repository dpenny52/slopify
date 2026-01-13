# Agents Learnings - src/

## Project Structure

- **components/**: UI components organized by feature (ui/, auth/, video/, editor/, projects/)
- **hooks/**: Custom React hooks for business logic
- **lib/**: Utility functions organized by domain (video/, canvas/, utils/)
- **pages/**: Route page components (HomePage, EditorPage)
- **types/**: TypeScript type definitions
- **constants/**: App-wide constants
- **test/**: Test setup files

## Path Aliases

Path aliases are configured in both `tsconfig.json` and `vite.config.ts`:

- `@/*` → `./src/*`
- `@components/*` → `./src/components/*`
- `@hooks/*` → `./src/hooks/*`
- `@lib/*` → `./src/lib/*`
- `@pages/*` → `./src/pages/*`
- `@types/*` → `./src/types/*`

## Styling

- Using Tailwind CSS with CSS custom properties for theming
- Dark theme inspired by Obsidian.md
- CSS variables defined in `index.css`: `--background`, `--background-secondary`, `--text-primary`, `--text-secondary`, `--accent`, `--border`

## Testing

- Vitest + React Testing Library
- Test files co-located with components (e.g., `HomePage.test.tsx`)
- Setup file at `test/setup.ts` imports `@testing-library/jest-dom`
- Use `MemoryRouter` wrapper for components using React Router

## Code Rules

- No `any` types - use proper TypeScript interfaces
- Early returns for error/loading states in components
- Business logic in hooks/, utilities in lib/
- Test public behavior, not implementation details
