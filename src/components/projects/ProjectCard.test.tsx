import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProjectCard from './ProjectCard'
import { type Project } from '@/hooks/useProjects'

const mockProject: Project = {
  _id: 'project123' as Project['_id'],
  _creationTime: 1704067200000,
  name: 'My Test Project',
  overlayIds: ['overlay1', 'overlay2', 'overlay3'],
  positions: [0, 1, 2],
  createdAt: 1704067200000,
  userId: 'user123',
}

describe('ProjectCard', () => {
  it('renders project name', () => {
    render(
      <ProjectCard project={mockProject} onLoad={vi.fn()} onDelete={vi.fn()} />
    )

    expect(screen.getByText('My Test Project')).toBeInTheDocument()
  })

  it('displays overlay count', () => {
    render(
      <ProjectCard project={mockProject} onLoad={vi.fn()} onDelete={vi.fn()} />
    )

    expect(screen.getByText('3 overlays')).toBeInTheDocument()
  })

  it('displays singular overlay for single overlay', () => {
    const singleOverlayProject = {
      ...mockProject,
      overlayIds: ['overlay1'],
      positions: [0],
    }
    render(
      <ProjectCard
        project={singleOverlayProject}
        onLoad={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    expect(screen.getByText('1 overlay')).toBeInTheDocument()
  })

  it('displays creation date', () => {
    render(
      <ProjectCard project={mockProject} onLoad={vi.fn()} onDelete={vi.fn()} />
    )

    // The date formatting depends on locale, so just check for "Created"
    expect(screen.getByText(/Created/)).toBeInTheDocument()
  })

  it('calls onLoad when Load button is clicked', async () => {
    const user = userEvent.setup()
    const onLoad = vi.fn()

    render(
      <ProjectCard project={mockProject} onLoad={onLoad} onDelete={vi.fn()} />
    )

    await user.click(screen.getByRole('button', { name: /load/i }))

    expect(onLoad).toHaveBeenCalledWith(mockProject)
  })

  it('calls onDelete when Delete button is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()

    render(
      <ProjectCard project={mockProject} onLoad={vi.fn()} onDelete={onDelete} />
    )

    await user.click(screen.getByRole('button', { name: /delete/i }))

    expect(onDelete).toHaveBeenCalledWith(mockProject)
  })

  it('has Load and Delete buttons', () => {
    render(
      <ProjectCard project={mockProject} onLoad={vi.fn()} onDelete={vi.fn()} />
    )

    expect(screen.getByRole('button', { name: /load/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })
})
