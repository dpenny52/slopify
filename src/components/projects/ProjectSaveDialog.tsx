import { useState, FormEvent } from 'react'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface ProjectSaveDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string) => Promise<void>
  isSaving?: boolean
  error?: string | null
}

export default function ProjectSaveDialog({
  isOpen,
  onClose,
  onSave,
  isSaving = false,
  error,
}: ProjectSaveDialogProps) {
  const [name, setName] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) {
      setValidationError('Project name is required')
      return
    }

    if (trimmedName.length < 2) {
      setValidationError('Project name must be at least 2 characters')
      return
    }

    if (trimmedName.length > 100) {
      setValidationError('Project name must be less than 100 characters')
      return
    }

    setValidationError(null)
    await onSave(trimmedName)
  }

  const handleClose = () => {
    setName('')
    setValidationError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Save Project">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name for your project"
          error={validationError || undefined}
          disabled={isSaving}
          autoFocus
        />

        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSaving}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  )
}
