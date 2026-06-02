export const ApiRoutes = {
  AUTH: {
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
} as const

export type ApiRoute = typeof ApiRoutes
