"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema } from "@/validations/task"

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function createTask(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const raw = {
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    priority: formData.get("priority") || "MEDIUM",
    projectId: formData.get("projectId"),
    dueDate: formData.get("dueDate") || undefined,
  }

  const parsed = createTaskSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const project = await db.project.findUnique({
    where: { id: parsed.data.projectId, userId: session.user.id },
    select: { id: true },
  })

  if (!project) {
    return { success: false, error: "Project not found" }
  }

  const task = await db.task.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      priority: parsed.data.priority,
      projectId: parsed.data.projectId,
      userId: session.user.id,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
    },
    select: { id: true },
  })

  return { success: true, data: { id: task.id } }
}

export async function updateTask(
  taskId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const raw = {
    title: formData.get("title") || undefined,
    description: formData.get("description") || undefined,
    priority: formData.get("priority") || undefined,
    dueDate: formData.get("dueDate") || undefined,
  }

  const parsed = updateTaskSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const existing = await db.task.findUnique({
    where: { id: taskId, userId: session.user.id },
    select: { id: true },
  })

  if (!existing) {
    return { success: false, error: "Task not found" }
  }

  await db.task.update({
    where: { id: taskId, userId: session.user.id },
    data: {
      ...parsed.data,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
    },
  })

  return { success: true, data: undefined }
}

export async function updateTaskStatus(
  taskId: string,
  status: string
): Promise<ActionResult<void>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const parsed = updateTaskStatusSchema.safeParse({ status })
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const existing = await db.task.findUnique({
    where: { id: taskId, userId: session.user.id },
    select: { id: true },
  })

  if (!existing) {
    return { success: false, error: "Task not found" }
  }

  await db.task.update({
    where: { id: taskId, userId: session.user.id },
    data: { status: parsed.data.status },
  })

  return { success: true, data: undefined }
}

export async function deleteTask(
  taskId: string
): Promise<ActionResult<void>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const existing = await db.task.findUnique({
    where: { id: taskId, userId: session.user.id },
    select: { id: true },
  })

  if (!existing) {
    return { success: false, error: "Task not found" }
  }

  await db.task.delete({
    where: { id: taskId, userId: session.user.id },
  })

  return { success: true, data: undefined }
}
