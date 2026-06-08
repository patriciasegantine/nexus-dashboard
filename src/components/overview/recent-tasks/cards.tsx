import { ClipboardList } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { StatusBadge } from '@/components/tasks/status-badge'
import { PriorityBadge } from '@/components/tasks/priority-badge'
import type { RecentTask } from '@/types/task'

interface RecentTasksCardsProps {
  tasks: RecentTask[]
  onSelect: (task: RecentTask) => void
}

export function RecentTasksCards({ tasks, onSelect }: RecentTasksCardsProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
        <ClipboardList className="h-8 w-8" />
        <p className="text-sm">No tasks yet.</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-border">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-start justify-between gap-3 px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors"
          onClick={() => onSelect(task)}
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-snug truncate">{task.title}</p>
            {task.project && (
              <p className="text-xs text-muted-foreground mt-0.5">{task.project.name}</p>
            )}
            <div className="flex items-center gap-2 mt-1.5">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
            {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
          </span>
        </li>
      ))}
    </ul>
  )
}
