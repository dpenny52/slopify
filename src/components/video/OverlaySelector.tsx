import { useEffect } from 'react'
import OverlayThumbnail from './OverlayThumbnail'
import { useOverlays } from '@hooks/useOverlays'
import type { OverlayVideo } from '@/types/overlay'

interface OverlaySelectorProps {
  onSelectionChange?: (selectedOverlays: OverlayVideo[]) => void
}

export default function OverlaySelector({
  onSelectionChange,
}: OverlaySelectorProps) {
  const {
    overlays,
    selectionCount,
    maxSelection,
    isSelected,
    canSelect,
    toggleSelection,
    getSelectedOverlays,
  } = useOverlays()

  // Notify parent when selection changes
  useEffect(() => {
    onSelectionChange?.(getSelectedOverlays())
  }, [selectionCount, getSelectedOverlays, onSelectionChange])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-[var(--text-primary)]">
          Select Overlays
        </h3>
        <span
          className={`text-sm ${
            selectionCount === 0
              ? 'text-[var(--text-secondary)]'
              : selectionCount === maxSelection
                ? 'text-[var(--accent)]'
                : 'text-[var(--text-primary)]'
          }`}
          aria-live="polite"
        >
          {selectionCount}/{maxSelection} selected
        </span>
      </div>

      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        role="group"
        aria-label="Overlay video selection"
      >
        {overlays.map((overlay) => (
          <OverlayThumbnail
            key={overlay.id}
            overlay={overlay}
            isSelected={isSelected(overlay.id)}
            disabled={!canSelect && !isSelected(overlay.id)}
            onToggle={() => toggleSelection(overlay.id)}
          />
        ))}
      </div>

      {selectionCount === 0 && (
        <p className="text-sm text-[var(--text-secondary)] text-center">
          Select at least 1 overlay to continue
        </p>
      )}
    </div>
  )
}
