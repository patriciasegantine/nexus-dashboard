import { getTasks } from "@/lib/data/tasks"
import { TasksPageClient } from "@/components/tasks/tasks-page-client"

export default async function TasksPage() {
  const tasks = await getTasks()

  return (
    <div className="space-y-6">
      <TasksPageClient initialTasks={tasks} />
    </div>
  )
}
