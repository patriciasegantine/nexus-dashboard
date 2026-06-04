export const QUERY_KEYS = {
  AUTH: {
    USER: ['auth', 'user'],
    SESSION: ['auth', 'session'],
  },
  DASHBOARD: {
    STATS: ['dashboard', 'stats'],
    ACTIVITIES: ['dashboard', 'activities'],
  },
  PROJECTS: {
    ALL: ['projects'],
    DETAIL: (id: string) => ['projects', id],
  },
  TASKS: {
    ALL: ['tasks'],
    BY_PROJECT: (projectId: string) => ['tasks', 'project', projectId],
    DETAIL: (id: string) => ['tasks', id],
  },
} as const
