# Agents Learnings - UI Components

## Component Library Overview

All UI components follow these patterns:

- Fully typed with TypeScript (no `any` types)
- ARIA compliant for accessibility
- Dark theme using CSS custom properties
- Consistent styling with Tailwind CSS

## Components

### Button

- Variants: `primary`, `secondary`, `outline`, `danger`
- Props: `variant`, `isLoading`, `disabled` + standard button props
- Uses `forwardRef` for ref forwarding

### Card

- Padding options: `none`, `sm`, `md`, `lg`
- Uses `forwardRef` for ref forwarding

### Modal

- Portal-based rendering to `document.body`
- Closes on overlay click or Escape key
- Locks body scroll when open
- Focus management with `tabIndex={-1}`

### ProgressBar

- Size options: `sm`, `md`, `lg`
- Progress clamped to 0-100
- Optional label display
- Full ARIA support

### Input

- Supports labels and error messages
- Auto-generates ID from label
- Error state styling and `aria-invalid`

### Toast (ToastProvider + useToast)

- Types: `success`, `error`, `info`, `warning`
- Auto-dismiss after 4 seconds
- Manual dismiss with X button
- Context split into separate file (`ToastContext.ts`) to avoid fast-refresh warning

## Testing Notes

- Use `fireEvent.click` instead of `userEvent.click` with fake timers
- Modal overlay click test needs `fireEvent.click` on the dialog element directly
- Toast tests use fake timers for auto-dismiss testing

## Exports

All components exported from `index.ts`:

```typescript
import {
  Button,
  Card,
  Modal,
  ProgressBar,
  Input,
  ToastProvider,
  useToast,
} from '@components/ui'
```
