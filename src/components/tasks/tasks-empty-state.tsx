'use client'

import { Button } from "@/components/ui/button"
import { ClipboardList, Plus } from "lucide-react"

interface TasksEmptyStateProps {
  hasFilters: boolean
  onNewTask: () => void
}

export function TasksEmptyState({ hasFilters, onNewTask }: TasksEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[20rem] text-center">
      <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
      {hasFilters ? (
        <p className="text-muted-foreground">No tasks match your filters.</p>
      ) : (
        <>
          <p className="text-muted-foreground mb-4">No tasks yet. Create your first one.</p>
          <Button size="sm" onClick={onNewTask}>
            <Plus className="h-4 w-4 mr-2" />
            New task
          </Button>
        </>
      )}
    </div>
  )
}
