import type { TaskCard } from './task'

export interface Project {
  id: string
  name: string
  description?: string | null
  tags: string[]
  userId: string
  createdAt: Date
}

export interface ProjectBoardItem extends Omit<Project, 'userId'> {
  total: number
  todo: number
  inProgress: number
  done: number
  progress: number
  overdue: number
}

export interface ProjectWithTasks extends Project {
  tasks: TaskCard[]
}

export interface RecentProject {
  id: string
  name: string
  description?: string | null
  createdAt: Date
  _count: { tasks: number }
}
