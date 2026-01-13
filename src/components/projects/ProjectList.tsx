import ProjectCard from './ProjectCard'
import { type Project } from '@/hooks/useProjects'

interface ProjectListProps {
  projects: Project[]
  onLoad: (project: Project) => void
  onDelete: (project: Project) => void
}

export default function ProjectList({
  projects,
  onLoad,
  onDelete,
}: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[var(--text-secondary)]">No saved projects yet.</p>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Save a project to see it here.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
          onLoad={onLoad}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
