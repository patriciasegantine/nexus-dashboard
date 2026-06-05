import { getProject } from "@/lib/data/projects"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { TASK_STATUS_NAMES, TASK_PRIORITIES_COLORS, TASK_PRIORITY_NAMES } from "@/constants/task"
import type { TaskStatus } from "@/types/task"

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>
}

const STATUS_COLUMNS: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"]

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params
  const project = await getProject(id)

  if (!project) notFound()

  const tasksByStatus = STATUS_COLUMNS.reduce((acc, status) => {
    acc[status] = project.tasks.filter((t) => t.status === status)
    return acc
  }, {} as Record<TaskStatus, typeof project.tasks>)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
        {project.description && (
          <p className="text-muted-foreground">{project.description}</p>
        )}
      </div>

      {project.tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-muted-foreground">No tasks yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATUS_COLUMNS.map((status) => (
            <div key={status} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium">{TASK_STATUS_NAMES[status]}</h2>
                <Badge variant="secondary">{tasksByStatus[status].length}</Badge>
              </div>
              <div className="space-y-2">
                {tasksByStatus[status].map((task) => (
                  <Card key={task.id}>
                    <CardContent className="p-3 space-y-2">
                      <p className="text-sm font-medium line-clamp-2">{task.title}</p>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="secondary"
                          className="text-xs"
                          style={{ backgroundColor: TASK_PRIORITIES_COLORS[task.priority] }}
                        >
                          {TASK_PRIORITY_NAMES[task.priority]}
                        </Badge>
                        {task.dueDate && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
