'use client'

import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { TasksList } from "@/components/tasks/tasks-list"
import { TaskDialog } from "@/components/tasks/task-dialog"
import { TaskFilters } from "@/components/tasks/task-filters"
import { TaskPagination } from "@/components/tasks/task-pagination"
import { TasksEmptyState } from "@/components/tasks/tasks-empty-state"
import { TaskDeleteDialog } from "@/components/tasks/task-delete-dialog"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { duplicateTask, deleteTask } from "@/actions/tasks"
import { toast } from "@/hooks/use-toast"
import type { TaskListItem } from "@/types/task"
import type { Project } from "@/types/project"
import { Plus } from "lucide-react"

interface TasksPageClientProps {
  tasks: TaskListItem[]
  total: number
  projects: Project[]
  page: number
  perPage: number
  hasFilters: boolean
}

export function TasksPageClient({ tasks, total, projects, page, perPage, hasFilters }: TasksPageClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskListItem | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<TaskListItem | null>(null)
  const [isDuplicating, startDuplicate] = useTransition()

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

  function handleDuplicate(task: TaskListItem) {
    startDuplicate(async () => {
      const result = await duplicateTask(task.id)
      if (result.success) {
        toast({ title: "Task duplicated successfully." })
      } else {
        toast({ title: result.error, variant: "destructive" })
      }
    })
  }

  async function handleConfirmDelete(id: string) {
    setTaskToDelete(null)
    const result = await deleteTask(id)
    if (result.success) {
      toast({ title: "Task deleted." })
    } else {
      toast({ title: result.error, variant: "destructive" })
    }
  }

  return (
    <div className="flex flex-col gap-6 min-h-[calc(100vh-8rem)]">
      <PageHeader
        title="Tasks"
        description="All your tasks across projects"
        action={
          <Button size="sm" onClick={handleNewTask}>
            <Plus className="h-4 w-4 mr-2" />
            New task
          </Button>
        }
      />

      <TaskFilters projects={projects} />

      <hr className="border-border/60 -mt-2" />

      <div className="flex-1 relative">
        {isDuplicating && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px] rounded-lg">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {tasks.length === 0 ? (
          <TasksEmptyState hasFilters={hasFilters} onNewTask={handleNewTask} />
        ) : (
          <TasksList
            tasks={tasks}
            onTaskClick={handleEditTask}
            onDuplicate={handleDuplicate}
            onDelete={setTaskToDelete}
          />
        )}
      </div>

      <TaskPagination total={total} page={page} perPage={perPage} />

      <TaskDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        projectId={selectedTask?.project?.id}
        task={selectedTask || undefined}
      />

      <TaskDeleteDialog
        task={taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
