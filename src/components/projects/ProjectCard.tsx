import { useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { type Project } from '@/hooks/useProjects'

interface ProjectCardProps {
  project: Project
  onLoad: (project: Project) => void
  onDelete: (project: Project) => void
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function ProjectCard({
  project,
  onLoad,
  onDelete,
}: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (isDeleting) return
    setIsDeleting(true)
    try {
      await onDelete(project)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex-1">
        <h3 className="text-lg font-medium text-[var(--text-primary)]">
          {project.name}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          {project.overlayIds.length} overlay
          {project.overlayIds.length !== 1 ? 's' : ''}
        </p>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Created {formatDate(project.createdAt)}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="primary"
          onClick={() => onLoad(project)}
          className="flex-1"
        >
          Load
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={isDeleting}
          isLoading={isDeleting}
        >
          Delete
        </Button>
      </div>
    </Card>
  )
}
