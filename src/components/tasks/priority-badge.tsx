import { TASK_PRIORITIES_COLORS, TASK_PRIORITY_NAMES } from '@/constants/task'
import type { TaskPriority } from '@/types/task'

interface PriorityBadgeProps {
  priority: TaskPriority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="h-2 w-2 rounded-full shrink-0"
        style={{ backgroundColor: TASK_PRIORITIES_COLORS[priority] }}
      />
      <span className="text-sm">{TASK_PRIORITY_NAMES[priority]}</span>
    </div>
  )
}
