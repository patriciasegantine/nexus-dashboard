import { LayoutDashboard, FolderKanban, ListTodo, Settings } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { AppRoutes } from '@/constants/routes'

export const SIDEBAR_CONFIG = {
  COLLAPSED_WIDTH: 'w-[70px]',
  EXPANDED_WIDTH: 'w-64',
  TOP_OFFSET: 'top-[64px]',
  HEIGHT: 'h-[calc(100vh-64px)]',
} as const

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { title: 'Overview', href: AppRoutes.DASHBOARD.HOME, icon: LayoutDashboard },
  { title: 'Projects', href: AppRoutes.DASHBOARD.PROJECTS, icon: FolderKanban },
  { title: 'Tasks', href: AppRoutes.DASHBOARD.TASKS, icon: ListTodo },
]

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { title: 'Settings', href: AppRoutes.DASHBOARD.SETTINGS, icon: Settings },
]
