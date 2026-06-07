"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { AppRoutes } from "@/constants/routes"

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function clearAllData(): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const userId = session.user.id

  await db.$transaction([
    db.task.deleteMany({ where: { userId } }),
    db.project.deleteMany({ where: { userId } }),
  ])

  revalidatePath(AppRoutes.DASHBOARD.HOME)
  return { success: true, data: undefined }
}
