import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagProps {
  label: string
  onRemove?: () => void
  className?: string
}

export function Tag({ label, onRemove, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        'bg-secondary text-secondary-foreground',
        className,
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove tag ${label}`}
          className="ml-0.5 rounded-full p-0.5 text-secondary-foreground/60 hover:bg-secondary-foreground/15 hover:text-secondary-foreground transition-colors"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </span>
  )
}
