import { auth } from "@/auth"
import { db } from "@/lib/db"
import type { ProjectBoardItem } from "@/types/project"

export async function getProjects() {
  const session = await auth()
  if (!session?.user?.id) return []

  return db.project.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { tasks: true } },
      tasks: {
        select: { status: true },
      },
    },
  })
}

export async function getProject(projectId: string) {
  const session = await auth()
  if (!session?.user?.id) return null

  return db.project.findUnique({
    where: { id: projectId, userId: session.user.id },
    include: {
      tasks: {
        orderBy: { createdAt: "desc" },
      },
    },
  })
}

export async function getBoardData(): Promise<ProjectBoardItem[]> {
  const session = await auth()
  if (!session?.user?.id) return []

  const projects = await db.project.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      tasks: { select: { status: true, priority: true, dueDate: true } },
    },
  })

  return projects.map((project) => {
    const total = project.tasks.length
    const done = project.tasks.filter((t) => t.status === "DONE").length
    const inProgress = project.tasks.filter((t) => t.status === "IN_PROGRESS").length
    const todo = project.tasks.filter((t) => t.status === "TODO").length
    const progress = total > 0 ? Math.round((done / total) * 100) : 0
    const overdue = project.tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "DONE"
    ).length

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      tags: project.tags,
      createdAt: project.createdAt,
      total,
      done,
      inProgress,
      todo,
      progress,
      overdue,
    }
  })
}
