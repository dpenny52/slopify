# Agents Learnings - src/components/projects/

## Components

### ProjectCard

- Displays individual project with name, overlay count, creation date
- Load and Delete buttons
- formatDate helper for displaying creation timestamp

### ProjectList

- Grid display of ProjectCard components
- Shows empty state when no projects
- Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)

### ProjectSaveDialog

- Modal dialog for saving project
- Name input with validation (2-100 chars, required)
- Loading state, error display
- Uses Modal, Input, and Button components

### ReuploadPrompt

- Modal explaining video reupload requirement
- Shown when loading a saved project
- Confirms user understands main video isn't stored

## Usage

```tsx
import { ProjectList, ProjectSaveDialog, ReuploadPrompt } from '@/components/projects'

// Show project list
<ProjectList
  projects={projects}
  onLoad={handleLoad}
  onDelete={handleDelete}
/>

// Save dialog
<ProjectSaveDialog
  isOpen={isSaveOpen}
  onClose={() => setIsSaveOpen(false)}
  onSave={handleSave}
  isSaving={isLoading}
  error={error}
/>

// Reupload prompt
<ReuploadPrompt
  isOpen={isReuploadOpen}
  onClose={() => setIsReuploadOpen(false)}
  onConfirm={handleLoadConfirm}
  projectName={selectedProject?.name}
/>
```

## Dependencies

- Uses Modal, Input, Button, Card from ui/
- Uses Project type from useProjects hook
