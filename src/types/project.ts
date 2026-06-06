import type { TaskCard } from './task'

export interface Project {
  id: string
  name: string
  slug: string
  description?: string | null
  color: string
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

export type ProjectFormData = Pick<Project, 'name' | 'description' | 'tags'>

export interface RecentProject {
  id: string
  name: string
  slug: string
  description?: string | null
  color: string
  createdAt: Date
  _count: { tasks: number }
  doneTasks: number
}
