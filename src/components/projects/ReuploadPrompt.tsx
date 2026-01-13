import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface ReuploadPromptProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  projectName: string
}

export default function ReuploadPrompt({
  isOpen,
  onClose,
  onConfirm,
  projectName,
}: ReuploadPromptProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Load Project">
      <div className="flex flex-col gap-4">
        <p className="text-[var(--text-primary)]">
          Loading project <strong>"{projectName}"</strong>
        </p>
        <p className="text-sm text-[var(--text-secondary)]">
          Your main video is not stored with saved projects. You'll need to
          upload your video again after loading this project.
        </p>
        <p className="text-sm text-[var(--text-secondary)]">
          The overlay selections and positions will be restored.
        </p>

        <div className="flex gap-2 justify-end mt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="primary" onClick={onConfirm}>
            Load Project
          </Button>
        </div>
      </div>
    </Modal>
  )
}
