import { getTasks } from "@/lib/data/tasks"
import { Button } from "@/components/ui/button"
import { TasksList } from "@/components/tasks/tasks-list"
import { Plus } from "lucide-react"

export default async function TasksPage() {
  const tasks = await getTasks()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">All your tasks across projects</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New task
        </Button>
      </div>

      <TasksList tasks={tasks} />
    </div>
  )
}
