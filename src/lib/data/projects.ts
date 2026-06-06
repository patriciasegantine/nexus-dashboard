import { auth } from "@/auth"
import { db } from "@/lib/db"
import type { ProjectBoardItem, Project } from "@/types/project"

export async function getProjects(): Promise<Project[]> {
  const session = await auth()
  if (!session?.user?.id) return []

  return db.project.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      description: true,
      tags: true,
      userId: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getProject(projectId: string) {
  const session = await auth()
  if (!session?.user?.id) return null

  return db.project.findUnique({
    where: { id: projectId, userId: session.user.id },
    select: {
      id: true,
      name: true,
      description: true,
      tags: true,
      userId: true,
      createdAt: true,
      tasks: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          tags: true,
          dueDate: true,
        },
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
