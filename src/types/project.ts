export interface Project {
  id: string
  name: string
  description?: string | null
  tags: string[]
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface ProjectWithStats extends Project {
  total: number
  todo: number
  inProgress: number
  done: number
  progress: number
  overdue: number
}

export type ProjectBoardItem = Omit<ProjectWithStats, 'userId' | 'updatedAt'>

export type ProjectFormData = Pick<Project, 'name' | 'description' | 'tags'>
