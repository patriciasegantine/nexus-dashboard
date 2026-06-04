export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Task {
  id: string
  title: string
  description?: string | null
  status: TaskStatus
  priority: TaskPriority
  projectId: string
  userId: string
  dueDate?: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateTaskDTO {
  title: string
  description?: string
  priority: TaskPriority
  projectId: string
  dueDate?: string
}

export interface UpdateTaskDTO extends Partial<CreateTaskDTO> {
  status?: TaskStatus
}
