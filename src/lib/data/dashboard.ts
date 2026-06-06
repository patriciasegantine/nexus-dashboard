import { auth } from "@/auth"
import { db } from "@/lib/db"
import type { RecentTask } from "@/types/task"
import type { RecentProject } from "@/types/project"

export interface DashboardStats {
  totalTasks: number
  inProgress: number
  completed: number
  overdue: number
  byStatus: Record<string, number>
  byPriority: Record<string, number>
  recentTasks: RecentTask[]
  recentProjects: RecentProject[]
}

export async function getDashboardStats(): Promise<DashboardStats | null> {
  const session = await auth()
  if (!session?.user?.id) return null

  const userId = session.user.id
  const now = new Date()

  const [tasksByStatus, tasksByPriority, overdue, recentTasks, recentProjects] =
    await Promise.all([
      db.task.groupBy({
        by: ["status"],
        where: { userId },
        _count: { _all: true },
      }),
      db.task.groupBy({
        by: ["priority"],
        where: { userId },
        _count: { _all: true },
      }),
      db.task.count({
        where: {
          userId,
          dueDate: { lt: now },
          status: { not: "DONE" },
        },
      }),
      db.task.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          tags: true,
          dueDate: true,
          updatedAt: true,
          project: { select: { id: true, name: true } },
        },
      }),
      db.project.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          _count: { select: { tasks: true } },
          tasks: { where: { status: "DONE" }, select: { id: true } },
        },
      }),
    ])

  const byStatus = Object.fromEntries(
    tasksByStatus.map((s) => [s.status, s._count._all])
  )

  const byPriority = Object.fromEntries(
    tasksByPriority.map((p) => [p.priority, p._count._all])
  )

  const totalTasks = tasksByStatus.reduce((sum, s) => sum + s._count._all, 0)

  return {
    totalTasks,
    inProgress: byStatus["IN_PROGRESS"] ?? 0,
    completed: byStatus["DONE"] ?? 0,
    overdue,
    byStatus,
    byPriority,
    recentTasks,
    recentProjects: recentProjects.map(({ tasks, ...p }) => ({
      ...p,
      doneTasks: tasks.length,
    })),
  }
}
