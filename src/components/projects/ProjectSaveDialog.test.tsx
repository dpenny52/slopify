import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProjectSaveDialog from './ProjectSaveDialog'

describe('ProjectSaveDialog', () => {
  it('does not render when closed', () => {
    render(
      <ProjectSaveDialog isOpen={false} onClose={vi.fn()} onSave={vi.fn()} />
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders when open', () => {
    render(
      <ProjectSaveDialog isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Save Project' })
    ).toBeInTheDocument()
  })

  it('has project name input', () => {
    render(
      <ProjectSaveDialog isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />
    )

    expect(screen.getByLabelText('Project Name')).toBeInTheDocument()
  })

  it('validates empty name', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()

    render(
      <ProjectSaveDialog isOpen={true} onClose={vi.fn()} onSave={onSave} />
    )

    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(screen.getByText('Project name is required')).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })

  it('validates short name', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()

    render(
      <ProjectSaveDialog isOpen={true} onClose={vi.fn()} onSave={onSave} />
    )

    await user.type(screen.getByLabelText('Project Name'), 'A')
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(
      screen.getByText('Project name must be at least 2 characters')
    ).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })

  it('calls onSave with valid name', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()

    render(
      <ProjectSaveDialog isOpen={true} onClose={vi.fn()} onSave={onSave} />
    )

    await user.type(screen.getByLabelText('Project Name'), 'My Project')
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(onSave).toHaveBeenCalledWith('My Project')
  })

  it('trims whitespace from name', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()

    render(
      <ProjectSaveDialog isOpen={true} onClose={vi.fn()} onSave={onSave} />
    )

    await user.type(screen.getByLabelText('Project Name'), '  My Project  ')
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(onSave).toHaveBeenCalledWith('My Project')
  })

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <ProjectSaveDialog isOpen={true} onClose={onClose} onSave={vi.fn()} />
    )

    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(onClose).toHaveBeenCalled()
  })

  it('shows loading state when saving', () => {
    render(
      <ProjectSaveDialog
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        isSaving={true}
      />
    )

    // When loading, the button shows "Loading..." instead of "Save"
    const submitButton = screen.getByRole('button', { name: /loading/i })
    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  it('displays error message', () => {
    render(
      <ProjectSaveDialog
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        error="Failed to save"
      />
    )

    expect(screen.getByText('Failed to save')).toBeInTheDocument()
  })
})
