'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import { StatusBadge } from "@/components/tasks/status-badge"
import { PriorityBadge } from "@/components/tasks/priority-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Pencil, Copy, Trash2, CalendarDays } from "lucide-react"
import { format, isBefore, startOfToday } from "date-fns"
import type { TaskCard as TaskCardType } from "@/types/task"

interface TaskCardProps {
  task: TaskCardType & { project?: { id?: string; name: string } | null }
  onClick?: () => void
  onEdit?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
  showProject?: boolean
}

export function TaskCard({ task, onClick, onEdit, onDuplicate, onDelete, showProject = false }: TaskCardProps) {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null
  const isOverdue = dueDate != null && task.status !== 'DONE' && isBefore(dueDate, startOfToday())

  return (
    <Card
      className="group hover:shadow-md transition-all duration-200 h-full cursor-pointer border border-border shadow-sm bg-card"
      onClick={onClick}
    >
      <CardContent className="p-4 flex flex-col h-full gap-3">

        {/* Title + date on same line */}
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-sm leading-tight line-clamp-2 text-foreground flex-1 min-w-0">
            {task.title}
          </p>
          <div className={`flex items-center gap-1 shrink-0 text-xs mt-0.5 ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
            <CalendarDays className="h-3.5 w-3.5" />
            {dueDate ? format(dueDate, 'MMM d') : '—'}
          </div>
        </div>

        {/* Project name */}
        {showProject && task.project && (
          <p className="text-xs text-muted-foreground -mt-1">{task.project.name}</p>
        )}

        {/* Status + Priority */}
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>

        {/* Footer: tags (left) + ⋮ menu (right) */}
        <div className="flex items-center justify-between gap-2 mt-auto min-h-[22px]">
          <div className="flex flex-wrap gap-1 min-w-0">
            {task.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
            {task.tags.length > 3 && (
              <span className="text-xs text-muted-foreground self-center">
                +{task.tags.length - 3}
              </span>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-1 rounded hover:bg-muted shrink-0 -mb-0.5 -mr-1 text-muted-foreground hover:text-foreground"
                onClick={(e) => e.stopPropagation()}
                aria-label="Task options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); onEdit?.() }}
                className="cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); onDuplicate?.() }}
                className="cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); onDelete?.() }}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </CardContent>
    </Card>
  )
}
