'use client'

import { useState, useTransition } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { TaskCard } from "@/components/tasks/task-card"
import { TaskDialog } from "@/components/tasks/task-dialog"
import { ProjectDialog } from "@/components/projects/project-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TASK_STATUS_NAMES, TASK_STATUS_COLUMNS } from "@/constants/task"
import { AppRoutes } from "@/constants/routes"
import { deleteProject } from "@/actions/projects"
import type { TaskStatus, TaskCard as TaskCardType } from "@/types/task"
import type { ProjectWithTasks } from "@/types/project"

interface ProjectKanbanProps {
  project: ProjectWithTasks
}

export function ProjectKanban({ project }: ProjectKanbanProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskCardType | null>(null)
  const [editProjectOpen, setEditProjectOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const [isPending, startTransition] = useTransition()

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

  function handleDelete() {
    startTransition(async () => {
      await deleteProject(project.id)
      router.push(AppRoutes.DASHBOARD.PROJECTS)
    })
  }

  return (
    <>
      <div className="space-y-6">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link
            href={AppRoutes.DASHBOARD.PROJECTS}
            className="hover:text-foreground transition-colors"
          >
            Projects
          </Link>
          <span>/</span>
          <span className="text-foreground">{project.name}</span>
        </nav>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="rounded-md h-10 w-10 flex items-center justify-center shrink-0"
              style={{ backgroundColor: project.color }}
            >
              <span className="text-white text-base font-semibold">
                {project.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight truncate">{project.name}</h1>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setEditProjectOpen(true)}>
                      <Pencil className="h-3.5 w-3.5 mr-2" />
                      Edit project
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteOpen(true)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Delete project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {project.description && (
                <p className="text-sm text-muted-foreground truncate">{project.description}</p>
              )}
            </div>
          </div>

          <div className="shrink-0">
            <Button size="sm" onClick={handleNewTask}>
              <Plus className="h-4 w-4 mr-2" />
              New task
            </Button>
          </div>
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

      <ProjectDialog
        open={editProjectOpen}
        onOpenChange={setEditProjectOpen}
        project={project}
      />

      <AlertDialog open={deleteOpen} onOpenChange={(open) => { setDeleteOpen(open); if (!open) setDeleteConfirm("") }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This will permanently delete{" "}
              <span className="font-medium text-foreground">&ldquo;{project.name}&rdquo;</span>{" "}
              and all its tasks. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              To confirm, type <span className="font-medium text-foreground">{project.slug}</span> below:
            </Label>
            <Input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder={project.slug}
              disabled={isPending}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isPending || deleteConfirm !== project.slug}
            >
              {isPending ? "Deleting..." : "Delete project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
