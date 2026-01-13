import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StepIndicator from './StepIndicator'

const mockSteps = [
  { id: 'upload', label: 'Upload' },
  { id: 'select', label: 'Select' },
  { id: 'arrange', label: 'Arrange' },
  { id: 'process', label: 'Process' },
  { id: 'download', label: 'Download' },
]

describe('StepIndicator', () => {
  it('renders all steps', () => {
    render(<StepIndicator steps={mockSteps} currentStep={0} />)

    mockSteps.forEach((step) => {
      expect(screen.getByText(step.label)).toBeInTheDocument()
    })
  })

  it('marks current step as current', () => {
    render(<StepIndicator steps={mockSteps} currentStep={2} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons[2]).toHaveAttribute('aria-current', 'step')
  })

  it('does not mark non-current steps as current', () => {
    render(<StepIndicator steps={mockSteps} currentStep={2} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).not.toHaveAttribute('aria-current')
    expect(buttons[1]).not.toHaveAttribute('aria-current')
    expect(buttons[3]).not.toHaveAttribute('aria-current')
    expect(buttons[4]).not.toHaveAttribute('aria-current')
  })

  it('shows checkmark for completed steps', () => {
    render(<StepIndicator steps={mockSteps} currentStep={2} />)

    // Steps 0 and 1 are completed (before currentStep 2)
    // They should show SVG checkmarks instead of numbers
    const buttons = screen.getAllByRole('button')

    // Completed steps have SVG with checkmark
    const svg0 = buttons[0]?.querySelector('svg')
    const svg1 = buttons[1]?.querySelector('svg')
    expect(svg0).toBeInTheDocument()
    expect(svg1).toBeInTheDocument()

    // Current and future steps show numbers
    expect(buttons[2]).toHaveTextContent('3')
    expect(buttons[3]).toHaveTextContent('4')
    expect(buttons[4]).toHaveTextContent('5')
  })

  it('allows clicking on completed steps when onStepClick is provided', async () => {
    const user = userEvent.setup()
    const onStepClick = vi.fn()

    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={2}
        onStepClick={onStepClick}
      />
    )

    const buttons = screen.getAllByRole('button')

    // Click on completed step (step 0)
    if (buttons[0]) await user.click(buttons[0])
    expect(onStepClick).toHaveBeenCalledWith(0)

    // Click on another completed step (step 1)
    if (buttons[1]) await user.click(buttons[1])
    expect(onStepClick).toHaveBeenCalledWith(1)
  })

  it('disables clicking on current and future steps', async () => {
    const user = userEvent.setup()
    const onStepClick = vi.fn()

    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={2}
        onStepClick={onStepClick}
      />
    )

    const buttons = screen.getAllByRole('button')

    // Current step should be disabled
    expect(buttons[2]).toBeDisabled()

    // Future steps should be disabled
    expect(buttons[3]).toBeDisabled()
    expect(buttons[4]).toBeDisabled()

    // Clicking disabled buttons should not trigger callback
    if (buttons[2]) await user.click(buttons[2])
    if (buttons[3]) await user.click(buttons[3])
    if (buttons[4]) await user.click(buttons[4])

    // Only expect calls from completed steps, not from disabled ones
    expect(onStepClick).not.toHaveBeenCalledWith(2)
    expect(onStepClick).not.toHaveBeenCalledWith(3)
    expect(onStepClick).not.toHaveBeenCalledWith(4)
  })

  it('disables all steps when onStepClick is not provided', () => {
    render(<StepIndicator steps={mockSteps} currentStep={2} />)

    const buttons = screen.getAllByRole('button')

    // All buttons should be disabled when no click handler
    buttons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })

  it('renders with navigation landmark', () => {
    render(<StepIndicator steps={mockSteps} currentStep={0} />)

    expect(screen.getByRole('navigation')).toHaveAttribute(
      'aria-label',
      'Progress'
    )
  })

  it('handles empty steps array', () => {
    render(<StepIndicator steps={[]} currentStep={0} />)

    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  it('handles single step', () => {
    render(
      <StepIndicator
        steps={[{ id: 'only', label: 'Only Step' }]}
        currentStep={0}
      />
    )

    expect(screen.getByText('Only Step')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'step')
  })
})
