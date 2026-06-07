'use client'

import { useEffect, useRef, useState, useTransition } from "react"
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
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || "")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [priority, setPriority] = useState<string>(task?.priority || "MEDIUM")
  const [status, setStatus] = useState<string>(task?.status || "TODO")
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task?.dueDate ? new Date(task.dueDate) : undefined
  )
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (open) {
      setError("")
      setTags(task?.tags ?? [])
      setTagInput("")
      setPriority(task?.priority || "MEDIUM")
      setStatus(task?.status || "TODO")
      setDueDate(task?.dueDate ? new Date(task.dueDate) : undefined)
      setSelectedProjectId(projectId || "")
      if (!task) {
        formRef.current?.reset()
      }

      if (isEditing || !projectId) {
        fetchProjects().then(setProjects)
      }
    }
  }, [open, task, projectId, isEditing])

  function handleSubmit(formData: FormData) {
    if (!selectedProjectId && !projectId) {
      setError("Please select a project")
      return
    }

    formData.set("projectId", selectedProjectId || projectId || "")
    formData.set("priority", priority)
    formData.set("status", status)
    formData.set("tags", JSON.stringify(tags))
    formData.set("dueDate", dueDate ? format(dueDate, "yyyy-MM-dd") : "")
    setError("")
    startTransition(async () => {
      const result = isEditing
        ? await updateTask(task.id, formData)
        : await createTask(formData)

      if (!result.success) {
        setError(result.error)
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

        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Task title"
              defaultValue={task?.title}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Optional description"
              defaultValue={task?.description ?? ""}
            />
          </div>

          {(isEditing || !projectId) && (
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger id="project">
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

          {error && (
            <p className="text-sm text-destructive">{error}</p>
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
