import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ReuploadPrompt from './ReuploadPrompt'

describe('ReuploadPrompt', () => {
  it('does not render when closed', () => {
    render(
      <ReuploadPrompt
        isOpen={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        projectName="Test Project"
      />
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders when open', () => {
    render(
      <ReuploadPrompt
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        projectName="Test Project"
      />
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    // Title is "Load Project" - use heading role
    expect(
      screen.getByRole('heading', { name: 'Load Project' })
    ).toBeInTheDocument()
  })

  it('displays project name', () => {
    render(
      <ReuploadPrompt
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        projectName="My Awesome Project"
      />
    )

    expect(screen.getByText(/"My Awesome Project"/)).toBeInTheDocument()
  })

  it('explains video reupload requirement', () => {
    render(
      <ReuploadPrompt
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        projectName="Test Project"
      />
    )

    expect(screen.getByText(/main video is not stored/i)).toBeInTheDocument()
    expect(screen.getByText(/upload your video again/i)).toBeInTheDocument()
  })

  it('explains what will be restored', () => {
    render(
      <ReuploadPrompt
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        projectName="Test Project"
      />
    )

    expect(
      screen.getByText(/overlay selections and positions will be restored/i)
    ).toBeInTheDocument()
  })

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <ReuploadPrompt
        isOpen={true}
        onClose={onClose}
        onConfirm={vi.fn()}
        projectName="Test Project"
      />
    )

    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(onClose).toHaveBeenCalled()
  })

  it('calls onConfirm when Load Project is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()

    render(
      <ReuploadPrompt
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={onConfirm}
        projectName="Test Project"
      />
    )

    await user.click(screen.getByRole('button', { name: /load project/i }))

    expect(onConfirm).toHaveBeenCalled()
  })
})
