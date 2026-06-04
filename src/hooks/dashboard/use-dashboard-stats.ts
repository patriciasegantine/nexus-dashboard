import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import type { DashboardStats } from '@/types/dashboard'

const mockStats: DashboardStats = {
  totalTasks: 45,
  todo: 5,
  inProgress: 12,
  completed: 28,
  completionRate: 62,
  byStatus: {
    'TODO': 5,
    'IN_PROGRESS': 12,
    'DONE': 28,
  },
  byPriority: {
    'HIGH': 10,
    'MEDIUM': 20,
    'LOW': 15,
  },
}

export function useDashboardStats() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.STATS,
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockStats
    },
  })
}
