interface Step {
  id: string
  label: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (stepIndex: number) => void
}

export default function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-center gap-2 sm:gap-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isClickable = isCompleted && onStepClick

          return (
            <li key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg
                  transition-colors
                  ${
                    isCurrent
                      ? 'bg-[var(--accent)] text-white'
                      : isCompleted
                        ? 'bg-[var(--background-secondary)] text-[var(--accent)] hover:bg-[var(--border)] cursor-pointer'
                        : 'bg-[var(--background-secondary)] text-[var(--text-secondary)] cursor-default'
                  }
                `}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span
                  className={`
                    flex items-center justify-center
                    w-6 h-6 text-sm font-medium rounded-full
                    ${
                      isCompleted
                        ? 'bg-[var(--accent)] text-white'
                        : isCurrent
                          ? 'bg-white text-[var(--accent)]'
                          : 'bg-[var(--border)] text-[var(--text-secondary)]'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="hidden sm:inline text-sm font-medium">
                  {step.label}
                </span>
              </button>

              {index < steps.length - 1 && (
                <div
                  className={`
                    hidden sm:block w-8 h-0.5 mx-2
                    ${isCompleted ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}
                  `}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
