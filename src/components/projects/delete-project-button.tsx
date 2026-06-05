'use client'

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { deleteProject } from "@/actions/projects"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface DeleteProjectButtonProps {
  projectId: string
  projectName: string
}

export function DeleteProjectButton({ projectId, projectName }: DeleteProjectButtonProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    setError("")
    startTransition(async () => {
      const result = await deleteProject(projectId)

      if (!result.success) {
        setError(result.error)
        return
      }

      setOpen(false)
      router.refresh()
    })
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-destructive"
        onClick={(e) => { e.preventDefault(); setOpen(true) }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-medium text-foreground">{projectName}</span>? This will also delete all tasks in this project. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete project"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
