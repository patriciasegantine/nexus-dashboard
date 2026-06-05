import { auth } from "@/auth"
import { db } from "@/lib/db"

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
