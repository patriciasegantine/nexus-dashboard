'use client'

import { TaskCard } from "@/components/tasks/task-card"
import type { TaskListItem } from "@/types/task"

interface TasksListProps {
  tasks: TaskListItem[]
  onTaskClick?: (task: TaskListItem) => void
  onDuplicate?: (task: TaskListItem) => void
  onDelete?: (task: TaskListItem) => void
}

export function TasksList({ tasks, onTaskClick, onDuplicate, onDelete }: TasksListProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {tasks?.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          showProject={true}
          onClick={() => onTaskClick?.(task)}
          onEdit={() => onTaskClick?.(task)}
          onDuplicate={() => onDuplicate?.(task)}
          onDelete={() => onDelete?.(task)}
        />
      ))}
    </div>
  )
}
