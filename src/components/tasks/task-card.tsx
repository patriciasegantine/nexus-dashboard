'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/tasks/status-badge"
import { PriorityBadge } from "@/components/tasks/priority-badge"
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
        <div className="flex-1">
          <p className="font-semibold text-sm leading-tight line-clamp-2 text-foreground">
            {task.title}
          </p>
          {showProject && task.project && (
            <p className="text-xs text-muted-foreground mt-1">{task.project.name}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>

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
