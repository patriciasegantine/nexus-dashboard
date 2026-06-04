export const AppRoutes = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  DASHBOARD: {
    HOME: '/',
    BOARD: '/board',
    PROJECTS: '/projects',
    TASKS: '/tasks',
    PROFILE: '/profile',
    SETTINGS: '/settings',
  },
} as const
