'use client'

import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TagsInput } from "@/components/ui/tags-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { createTask, updateTask } from "@/actions/tasks"
import { fetchProjects } from "@/actions/projects"
import { TASK_PRIORITY_NAMES, TASK_STATUS_NAMES } from "@/constants/task"
import { INVALID_INPUT_CLASS } from "@/lib/form-styles"
import { cn } from "@/lib/utils"
import { taskFormSchema as taskSchema, type TaskFormValues } from "@/validations/task"
import { format } from "date-fns"
import type { TaskCard } from "@/types/task"

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId?: string
  task?: TaskCard
}

export function TaskDialog({ open, onOpenChange, projectId, task }: TaskDialogProps) {
  const isEditing = !!task
  const [serverError, setServerError] = useState("")
  const [isPending, startTransition] = useTransition()
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [priority, setPriority] = useState<string>(task?.priority || "MEDIUM")
  const [status, setStatus] = useState<string>(task?.status || "TODO")
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task?.dueDate ? new Date(task.dueDate) : undefined
  )

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
  })

  const selectedProjectId = watch("projectId") ?? ""

  useEffect(() => {
    if (open) {
      reset({
        title: task?.title ?? "",
        description: task?.description ?? "",
        projectId: projectId ?? "",
      })
      setServerError("")
      setTags(task?.tags ?? [])
      setTagInput("")
      setPriority(task?.priority || "MEDIUM")
      setStatus(task?.status || "TODO")
      setDueDate(task?.dueDate ? new Date(task.dueDate) : undefined)

      if (isEditing || !projectId) {
        fetchProjects().then(setProjects)
      }
    }
  }, [open, task, projectId, isEditing, reset])

  function onSubmit(data: TaskFormValues) {
    const formData = new FormData()
    formData.set("title", data.title)
    formData.set("description", data.description ?? "")
    formData.set("projectId", data.projectId)
    formData.set("priority", priority)
    formData.set("status", status)
    formData.set("tags", JSON.stringify(tags))
    formData.set("dueDate", dueDate ? format(dueDate, "yyyy-MM-dd") : "")

    setServerError("")
    startTransition(async () => {
      const result = isEditing
        ? await updateTask(task.id, formData)
        : await createTask(formData)

      if (!result.success) {
        setServerError(result.error)
        return
      }

      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit task" : "New task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Task title"
              className={cn(errors.title && INVALID_INPUT_CLASS)}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional description"
              {...register("description")}
            />
          </div>

          {(isEditing || !projectId) && (
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select
                value={selectedProjectId}
                onValueChange={(value) => setValue("projectId", value, { shouldValidate: true })}
              >
                <SelectTrigger id="project" className={cn(errors.projectId && INVALID_INPUT_CLASS)}>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectId && (
                <p className="text-xs text-destructive">{errors.projectId.message}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">{TASK_PRIORITY_NAMES.LOW}</SelectItem>
                  <SelectItem value="MEDIUM">{TASK_PRIORITY_NAMES.MEDIUM}</SelectItem>
                  <SelectItem value="HIGH">{TASK_PRIORITY_NAMES.HIGH}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">{TASK_STATUS_NAMES.TODO}</SelectItem>
                  <SelectItem value="IN_PROGRESS">{TASK_STATUS_NAMES.IN_PROGRESS}</SelectItem>
                  <SelectItem value="DONE">{TASK_STATUS_NAMES.DONE}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Due date</Label>
            <DatePicker
              value={dueDate}
              onChange={setDueDate}
              placeholder="Pick a due date"
            />
          </div>

          <TagsInput
            value={tags}
            onChange={setTags}
            inputValue={tagInput}
            onInputChange={setTagInput}
          />

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : isEditing ? "Save changes" : "Create task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
