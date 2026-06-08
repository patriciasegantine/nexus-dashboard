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
import { createProject, updateProject } from "@/actions/projects"
import { cn } from "@/lib/utils"
import { INVALID_INPUT_CLASS } from "@/lib/form-styles"
import { projectFormSchema as projectSchema, type ProjectFormValues } from "@/validations/project"
import { PROJECT_COLORS, DEFAULT_PROJECT_COLOR } from "./project-card.utils"

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: { id: string; name: string; description?: string | null; color?: string; tags?: string[] }
}

export function ProjectDialog({ open, onOpenChange, project }: ProjectDialogProps) {
  const isEditing = !!project
  const [serverError, setServerError] = useState("")
  const [isPending, startTransition] = useTransition()
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [color, setColor] = useState<string>(DEFAULT_PROJECT_COLOR)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
  })

  useEffect(() => {
    if (open) {
      reset({
        name: project?.name ?? "",
        description: project?.description ?? "",
      })
      setTags(project?.tags ?? [])
      setTagInput("")
      setColor(project?.color ?? DEFAULT_PROJECT_COLOR)
      setServerError("")
    }
  }, [open, project, reset])

  function onSubmit(data: ProjectFormValues) {
    const formData = new FormData()
    formData.set("name", data.name)
    formData.set("description", data.description ?? "")
    formData.set("tags", JSON.stringify(tags))
    formData.set("color", color)

    setServerError("")
    startTransition(async () => {
      const result = isEditing
        ? await updateProject(project.id, formData)
        : await createProject(formData)

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
          <DialogTitle>{isEditing ? "Edit project" : "New project"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Project name"
              className={cn(errors.name && INVALID_INPUT_CLASS)}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional description"
              rows={3}
              {...register("description")}
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "h-7 w-7 rounded-full transition-all",
                    color === c
                      ? "ring-2 ring-offset-2 ring-offset-background scale-110"
                      : "hover:scale-110 opacity-70 hover:opacity-100"
                  )}
                  style={{ backgroundColor: c, ...(color === c ? { '--tw-ring-color': c } as React.CSSProperties : {}) }}
                  aria-label={c}
                />
              ))}
            </div>
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
              {isPending ? "Saving..." : isEditing ? "Save changes" : "Create project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
