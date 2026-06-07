import { TaskPriority, TaskStatus } from "@/types/task"

export const TASK_STATUS_COLUMNS: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'] as const

export const TASK_STATUS_NAMES: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done'
} as const

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  TODO: '#94a3b8',        // slate-400
  IN_PROGRESS: '#3b82f6', // blue-500
  DONE: '#22c55e',        // green-500
} as const

export const TASK_PRIORITY_NAMES: Record<TaskPriority, string> = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
} as const

export const TASK_PRIORITIES_COLORS: Record<TaskPriority, string> = {
  HIGH: '#ef4444',   // red-500
  MEDIUM: '#eab308', // yellow-500
  LOW: '#22c55e',    // green-500
} as const

export const TASK_PRIORITY_BADGE_STYLES: Record<TaskPriority, string> = {
  LOW: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  MEDIUM: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  HIGH: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
} as const
