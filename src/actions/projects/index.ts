"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { createProjectSchema, updateProjectSchema } from "@/validations/project"

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function createProject(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const raw = {
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  }

  const parsed = createProjectSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const project = await db.project.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      userId: session.user.id,
    },
    select: { id: true },
  })

  return { success: true, data: { id: project.id } }
}

export async function updateProject(
  projectId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const raw = {
    name: formData.get("name") || undefined,
    description: formData.get("description") || undefined,
  }

  const parsed = updateProjectSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const existing = await db.project.findUnique({
    where: { id: projectId, userId: session.user.id },
    select: { id: true },
  })

  if (!existing) {
    return { success: false, error: "Project not found" }
  }

  await db.project.update({
    where: { id: projectId, userId: session.user.id },
    data: parsed.data,
  })

  return { success: true, data: undefined }
}

export async function deleteProject(
  projectId: string
): Promise<ActionResult<void>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const existing = await db.project.findUnique({
    where: { id: projectId, userId: session.user.id },
    select: { id: true },
  })

  if (!existing) {
    return { success: false, error: "Project not found" }
  }

  await db.project.delete({
    where: { id: projectId, userId: session.user.id },
  })

  return { success: true, data: undefined }
}
