import { auth } from "@/auth"
import { db } from "@/lib/db"
import type { TaskStatus, TaskPriority, TaskListItem } from "@/types/task"

export const TASKS_PER_PAGE = 12

export type DueDateFilter = 'overdue' | 'today' | 'this_week' | 'no_due_date'

export interface GetTasksFilters {
  status?: TaskStatus
  priority?: TaskPriority
  search?: string
  projectId?: string
  dueDate?: DueDateFilter
  page?: number
}

function buildDueDateWhere(dueDate: DueDateFilter) {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDay = new Date(startOfDay.getTime() + 86400000)
  const endOfWeek = new Date(startOfDay.getTime() + 7 * 86400000)

  switch (dueDate) {
    case 'overdue':
      return { dueDate: { lt: now }, status: { not: 'DONE' as TaskStatus } }
    case 'today':
      return { dueDate: { gte: startOfDay, lt: endOfDay } }
    case 'this_week':
      return { dueDate: { gte: startOfDay, lt: endOfWeek } }
    case 'no_due_date':
      return { dueDate: null }
  }
}

export async function getTasks(filters?: GetTasksFilters): Promise<{ tasks: TaskListItem[], total: number }> {
  const session = await auth()
  if (!session?.user?.id) return { tasks: [], total: 0 }

  const page = filters?.page ?? 1
  const skip = (page - 1) * TASKS_PER_PAGE

  const where = {
    userId: session.user.id,
    ...(filters?.status && { status: filters.status }),
    ...(filters?.priority && { priority: filters.priority }),
    ...(filters?.search && { title: { contains: filters.search, mode: 'insensitive' as const } }),
    ...(filters?.projectId && { projectId: filters.projectId }),
    ...(filters?.dueDate && buildDueDateWhere(filters.dueDate)),
  }

  const [tasks, total] = await db.$transaction([
    db.task.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: { project: { select: { id: true, name: true } } },
      skip,
      take: TASKS_PER_PAGE,
    }),
    db.task.count({ where }),
  ])

  return { tasks, total }
}

export async function getTasksByProject(projectId: string) {
  const session = await auth()
  if (!session?.user?.id) return []

  return db.task.findMany({
    where: { projectId, userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })
}

export async function getDashboardStats() {
  const session = await auth()
  if (!session?.user?.id) return null

  const [total, byStatus, byPriority, recentTasks, projectCount, recentProjects] = await Promise.all([
    db.task.count({ where: { userId: session.user.id } }),
    db.task.groupBy({
      by: ["status"],
      where: { userId: session.user.id },
      _count: true,
    }),
    db.task.groupBy({
      by: ["priority"],
      where: { userId: session.user.id },
      _count: true,
    }),
    db.task.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { project: { select: { name: true } } },
    }),
    db.project.count({ where: { userId: session.user.id } }),
    db.project.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        _count: { select: { tasks: true } },
      },
    }),
  ])

  const byStatusMap = Object.fromEntries(
    byStatus.map((s) => [s.status, s._count])
  )

  const byPriorityMap = Object.fromEntries(
    byPriority.map((p) => [p.priority, p._count])
  )

  const completed = byStatusMap["DONE"] ?? 0
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return {
    totalTasks: total,
    totalProjects: projectCount,
    todo: byStatusMap["TODO"] ?? 0,
    inProgress: byStatusMap["IN_PROGRESS"] ?? 0,
    completed,
    completionRate,
    byStatus: byStatusMap,
    byPriority: byPriorityMap,
    recentTasks,
    recentProjects,
  }
}

