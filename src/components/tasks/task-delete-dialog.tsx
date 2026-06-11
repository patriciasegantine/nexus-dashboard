'use client'

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
import type { TaskListItem } from "@/types/task"

interface TaskDeleteDialogProps {
  task: TaskListItem | null
  onClose: () => void
  onConfirm: () => void
}

export function TaskDeleteDialog({ task, onClose, onConfirm }: TaskDeleteDialogProps) {
  return (
    <AlertDialog
      open={!!task}
      onOpenChange={(open) => {
        if (!open) {
          setTimeout(() => { document.body.style.pointerEvents = '' }, 0)
          onClose()
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete task</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">&ldquo;{task?.title}&rdquo;</span>?{" "}
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
