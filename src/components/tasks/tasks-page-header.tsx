'use client'

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface TasksPageHeaderProps {
  onNewTask: () => void
}

export function TasksPageHeader({ onNewTask }: TasksPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">All your tasks across projects</p>
      </div>
      <Button size="sm" onClick={onNewTask}>
        <Plus className="h-4 w-4 mr-2" />
        New task
      </Button>
    </div>
  )
}
