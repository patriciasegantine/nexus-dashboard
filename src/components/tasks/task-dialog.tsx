'use client'

import { useEffect, useRef, useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TagsInput } from "@/components/ui/tags-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTask, updateTask } from "@/actions/tasks"
import { TASK_PRIORITY_NAMES, TASK_STATUS_NAMES } from "@/constants/task"
import { useRouter } from "next/navigation"
import type { TaskCard } from "@/types/task"

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  task?: TaskCard
}

export function TaskDialog({ open, onOpenChange, projectId, task }: TaskDialogProps) {
  const isEditing = !!task
  const router = useRouter()
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [priority, setPriority] = useState<string>(task?.priority || "MEDIUM")
  const [status, setStatus] = useState<string>(task?.status || "TODO")
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (open) {
      setError("")
      setTags(task?.tags ?? [])
      setTagInput("")
      setPriority(task?.priority || "MEDIUM")
      setStatus(task?.status || "TODO")
      if (!task) {
        formRef.current?.reset()
      }
    }
  }, [open, task])

  function handleSubmit(formData: FormData) {
    formData.set("projectId", projectId)
    formData.set("priority", priority)
    formData.set("status", status)
    formData.set("tags", JSON.stringify(tags))
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
      router.refresh()
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
