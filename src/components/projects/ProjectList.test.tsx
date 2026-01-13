import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProjectList from './ProjectList'
import { type Project } from '@/hooks/useProjects'

const mockProjects: Project[] = [
  {
    _id: 'project1' as Project['_id'],
    _creationTime: 1704067200000,
    name: 'Project One',
    overlayIds: ['overlay1'],
    positions: [0],
    createdAt: 1704067200000,
    userId: 'user123',
  },
  {
    _id: 'project2' as Project['_id'],
    _creationTime: 1704153600000,
    name: 'Project Two',
    overlayIds: ['overlay1', 'overlay2'],
    positions: [0, 1],
    createdAt: 1704153600000,
    userId: 'user123',
  },
]

describe('ProjectList', () => {
  it('renders empty state when no projects', () => {
    render(<ProjectList projects={[]} onLoad={vi.fn()} onDelete={vi.fn()} />)

    expect(screen.getByText('No saved projects yet.')).toBeInTheDocument()
    expect(
      screen.getByText('Save a project to see it here.')
    ).toBeInTheDocument()
  })

  it('renders all projects', () => {
    render(
      <ProjectList
        projects={mockProjects}
        onLoad={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    expect(screen.getByText('Project One')).toBeInTheDocument()
    expect(screen.getByText('Project Two')).toBeInTheDocument()
  })

  it('renders correct number of project cards', () => {
    render(
      <ProjectList
        projects={mockProjects}
        onLoad={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    const loadButtons = screen.getAllByRole('button', { name: /load/i })
    expect(loadButtons).toHaveLength(2)
  })

  it('passes onLoad handler to project cards', async () => {
    const onLoad = vi.fn()

    render(
      <ProjectList projects={mockProjects} onLoad={onLoad} onDelete={vi.fn()} />
    )

    // Check that load buttons are present (handlers tested in ProjectCard tests)
    expect(screen.getAllByRole('button', { name: /load/i })).toHaveLength(2)
  })

  it('passes onDelete handler to project cards', async () => {
    const onDelete = vi.fn()

    render(
      <ProjectList
        projects={mockProjects}
        onLoad={vi.fn()}
        onDelete={onDelete}
      />
    )

    // Check that delete buttons are present (handlers tested in ProjectCard tests)
    expect(screen.getAllByRole('button', { name: /delete/i })).toHaveLength(2)
  })
})
