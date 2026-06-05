import { TaskPriority, TaskStatus } from "@/types/task";

export const TASK_STATUS_COLUMNS: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'] as const

export const TASK_STATUS_NAMES: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done'
} as const

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  TODO: 'hsl(var(--status-todo))',
  IN_PROGRESS: 'hsl(var(--status-in-progress))',
  DONE: 'hsl(var(--status-done))'
} as const

export const TASK_PRIORITIES_COLORS: Record<TaskPriority, string> = {
  HIGH: 'hsl(var(--priority-high))',
  MEDIUM: 'hsl(var(--priority-medium))',
  LOW: 'hsl(var(--priority-low))'
} as const

export const TASK_PRIORITY_NAMES: Record<TaskPriority, string> = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
} as const
