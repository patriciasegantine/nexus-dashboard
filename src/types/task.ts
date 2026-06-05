export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Task {
  id: string
  title: string
  description?: string | null
  status: TaskStatus
  priority: TaskPriority
  tags: string[]
  projectId: string
  userId: string
  dueDate?: Date | null
  createdAt: Date
  updatedAt: Date
}

export type TaskCard = Omit<Task, 'projectId' | 'userId' | 'createdAt' | 'updatedAt'>

export interface RecentTask {
  id: string
  title: string
  status: TaskStatus
  updatedAt: Date
  project: { name: string } | null
}

export interface TaskListItem extends TaskCard {
  project: { id: string; name: string } | null
}
