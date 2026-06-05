'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { TASK_PRIORITY_NAMES, TASK_PRIORITIES_COLORS, TASK_STATUS_NAMES } from "@/constants/task"
import type { TaskStatus } from "@/types/task"

interface TaskCardProps {
  title: string
  status: TaskStatus
  priority: "LOW" | "MEDIUM" | "HIGH"
  dueDate?: Date | null
  projectName?: string
}

export function TaskCard({ title, status, priority, dueDate, projectName }: TaskCardProps) {
  return (
    <Card className="hover:bg-muted/50 transition-colors h-full">
      <CardContent className="p-3 space-y-2 flex flex-col h-full">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-medium line-clamp-2">{title}</p>
          {projectName && (
            <p className="text-xs text-muted-foreground">{projectName}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            {TASK_STATUS_NAMES[status]}
          </Badge>
          <Badge
            className="text-xs text-white"
            style={{ backgroundColor: TASK_PRIORITIES_COLORS[priority] }}
          >
            {TASK_PRIORITY_NAMES[priority]}
          </Badge>
        </div>

        {dueDate && (
          <p className="text-xs text-muted-foreground mt-auto">
            📅 {new Date(dueDate).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
