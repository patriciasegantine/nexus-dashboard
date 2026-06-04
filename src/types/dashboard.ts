export interface DashboardStats {
  totalTasks: number
  todo: number
  inProgress: number
  completed: number
  completionRate: number
  byStatus: Record<string, number>
  byPriority: Record<string, number>
}

export interface Activity {
  id: string
  user: {
    name: string
    avatar?: string
  }
  action: string
  target: string
  createdAt: string
}
