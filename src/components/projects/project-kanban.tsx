'use client'

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TaskCard } from "@/components/tasks/task-card"
import { TaskDialog } from "@/components/tasks/task-dialog"
import { Plus } from "lucide-react"
import { TASK_STATUS_NAMES, TASK_STATUS_COLUMNS } from "@/constants/task"
import type { TaskStatus, TaskCard as TaskCardType } from "@/types/task"
import type { ProjectWithTasks } from "@/types/project"

interface ProjectKanbanProps {
  project: ProjectWithTasks
}

export function ProjectKanban({ project }: ProjectKanbanProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskCardType | null>(null)

  const tasksByStatus = TASK_STATUS_COLUMNS.reduce((acc, status) => {
    acc[status] = project.tasks.filter((t) => t.status === status)
    return acc
  }, {} as Record<TaskStatus, typeof project.tasks>)

  function handleNewTask() {
    setSelectedTask(null)
    setDialogOpen(true)
  }

  function handleEditTask(task: TaskCardType) {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  function handleDialogClose() {
    setSelectedTask(null)
    setDialogOpen(false)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            {project.description && (
              <p className="text-muted-foreground">{project.description}</p>
            )}
          </div>
          <Button onClick={handleNewTask} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New task
          </Button>
        </div>

      {project.tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-muted-foreground">No tasks yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TASK_STATUS_COLUMNS.map((status) => (
            <div key={status} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium">{TASK_STATUS_NAMES[status]}</h2>
                <Badge variant="secondary">{tasksByStatus[status].length}</Badge>
              </div>
              <div className="space-y-2">
                {tasksByStatus[status].map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => handleEditTask(task)}
                    showProject={false}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        projectId={project.id}
        task={selectedTask || undefined}
      />
    </>
  )
}
