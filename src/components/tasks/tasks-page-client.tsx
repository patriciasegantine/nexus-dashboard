'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TasksList } from "@/components/tasks/tasks-list"
import { TaskDialog } from "@/components/tasks/task-dialog"
import { Plus } from "lucide-react"
import type { TaskListItem } from "@/types/task"

interface TasksPageClientProps {
  initialTasks: TaskListItem[]
}

export function TasksPageClient({ initialTasks }: TasksPageClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskListItem | null>(null)

  function handleNewTask() {
    setSelectedTask(null)
    setDialogOpen(true)
  }

  function handleEditTask(task: TaskListItem) {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  function handleDialogClose() {
    setSelectedTask(null)
    setDialogOpen(false)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">All your tasks across projects</p>
        </div>
        <Button size="sm" onClick={handleNewTask}>
          <Plus className="h-4 w-4 mr-2" />
          New task
        </Button>
      </div>

      <TasksList tasks={initialTasks} onTaskClick={handleEditTask} />

      <TaskDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        projectId={selectedTask?.project?.id}
        task={selectedTask || undefined}
      />
    </>
  )
}
