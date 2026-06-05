'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { TASK_PRIORITY_NAMES, TASK_PRIORITIES_COLORS, TASK_STATUS_NAMES } from "@/constants/task"
import type { TaskCard as TaskCardType } from "@/types/task"

interface TaskCardProps {
  task: TaskCardType & { project?: { id?: string; name: string } | null }
  onClick?: () => void
  showProject?: boolean
}

export function TaskCard({ task, onClick, showProject = false }: TaskCardProps) {
  return (
    <Card
      className="hover:shadow-md hover:bg-muted/30 transition-all duration-200 h-full cursor-pointer border border-border/50 bg-card"
      onClick={onClick}
    >
      <CardContent className="p-4 flex flex-col h-full gap-3">
        {/* Title section */}
        <div className="flex-1">
          <p className="font-semibold text-sm leading-tight line-clamp-2 text-foreground">
            {task.title}
          </p>
          {showProject && task.project && (
            <p className="text-xs text-muted-foreground mt-1">{task.project.name}</p>
          )}
        </div>

        {/* Status and Priority - Symmetric top */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="text-xs font-medium">
            {TASK_STATUS_NAMES[task.status]}
          </Badge>
          <Badge
            className="text-xs font-medium text-white"
            style={{ backgroundColor: TASK_PRIORITIES_COLORS[task.priority] }}
          >
            {TASK_PRIORITY_NAMES[task.priority]}
          </Badge>
        </div>

        {/* Tags - if any */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {task.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <span className="text-xs text-muted-foreground self-center">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
