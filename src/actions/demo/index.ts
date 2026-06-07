"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { generateSlug, ensureUniqueSlug } from "@/lib/slug"
import { AppRoutes } from "@/constants/routes"

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000)
const daysFromNow = (n: number) => new Date(Date.now() + n * 24 * 60 * 60 * 1000)

const SAMPLE_PROJECTS = [
  {
    name: "Website Redesign",
    description: "Modernize the company website with a new design system",
    color: "#3b82f6",
    tags: ["design", "frontend"],
    tasks: [
      { title: "Create wireframes for homepage", status: "DONE" as const, priority: "HIGH" as const, dueDate: daysAgo(14) },
      { title: "Design new color palette", status: "DONE" as const, priority: "MEDIUM" as const, dueDate: daysAgo(7) },
      { title: "Build responsive navigation", status: "IN_PROGRESS" as const, priority: "HIGH" as const, dueDate: daysAgo(3) },
      { title: "Implement contact form", status: "TODO" as const, priority: "MEDIUM" as const, dueDate: daysFromNow(7) },
      { title: "SEO optimization", status: "TODO" as const, priority: "LOW" as const, dueDate: daysFromNow(21) },
    ],
  },
  {
    name: "Mobile App v2",
    description: "Second major release with offline support and push notifications",
    color: "#8b5cf6",
    tags: ["mobile", "backend"],
    tasks: [
      { title: "User authentication flow", status: "DONE" as const, priority: "HIGH" as const, dueDate: daysAgo(21) },
      { title: "Push notification system", status: "IN_PROGRESS" as const, priority: "HIGH" as const, dueDate: daysAgo(7) },
      { title: "Offline mode support", status: "IN_PROGRESS" as const, priority: "MEDIUM" as const, dueDate: daysFromNow(5) },
      { title: "Performance profiling", status: "TODO" as const, priority: "MEDIUM" as const, dueDate: daysFromNow(14) },
      { title: "App store submission", status: "TODO" as const, priority: "LOW" as const, dueDate: daysFromNow(30) },
    ],
  },
  {
    name: "Data Pipeline",
    description: "ETL pipeline for analytics dashboards and automated reporting",
    color: "#10b981",
    tags: ["backend", "data"],
    tasks: [
      { title: "Set up data warehouse", status: "DONE" as const, priority: "HIGH" as const, dueDate: daysAgo(28) },
      { title: "Build ingestion scripts", status: "DONE" as const, priority: "HIGH" as const, dueDate: daysAgo(14) },
      { title: "Create transformation rules", status: "IN_PROGRESS" as const, priority: "MEDIUM" as const, dueDate: daysAgo(14) },
      { title: "Schedule automated reports", status: "TODO" as const, priority: "MEDIUM" as const, dueDate: daysFromNow(10) },
      { title: "Add data quality checks", status: "TODO" as const, priority: "LOW" as const, dueDate: daysFromNow(21) },
    ],
  },
]

export async function populateSampleData(): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const userId = session.user.id

  const existingCount = await db.project.count({ where: { userId } })
  if (existingCount > 0) {
    return { success: false, error: "Your workspace already has projects" }
  }

  const projectsWithSlugs = await Promise.all(
    SAMPLE_PROJECTS.map(async (p) => ({
      ...p,
      slug: await ensureUniqueSlug(
        generateSlug(p.name),
        async (candidate) =>
          !!(await db.project.findUnique({ where: { slug: candidate }, select: { id: true } }))
      ),
    }))
  )

  await db.$transaction(async (tx) => {
    for (const { tasks, slug, ...projectData } of projectsWithSlugs) {
      const project = await tx.project.create({
        data: { ...projectData, slug, userId },
        select: { id: true },
      })

      for (const task of tasks) {
        await tx.task.create({
          data: { ...task, projectId: project.id, userId },
        })
      }
    }
  })

  revalidatePath(AppRoutes.DASHBOARD.HOME)
  return { success: true, data: undefined }
}
