"use server"

import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"
import { db } from "@/lib/db"
import { signIn } from "@/auth"
import { AUTH_MESSAGES } from "@/constants/messages"
import { loginSchema, registerSchema } from "@/validations/auth"
import { sendWelcomeEmail } from "@/lib/email"

export type RegisterState = {
  success: boolean
  error?: string
  redirectTo?: string
}

export type LoginState = {
  success: boolean
  error?: string
}

export async function loginUser(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email.trim().toLowerCase(),
      password: parsed.data.password,
      redirectTo: "/",
    })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: AUTH_MESSAGES.INVALID_CREDENTIALS }
    }
    throw error
  }
}

export async function registerUser(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  }

  const parsed = registerSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const name = parsed.data.name.trim()
  const email = parsed.data.email.trim().toLowerCase()
  const { password } = parsed.data

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    return { success: false, error: AUTH_MESSAGES.USER_ALREADY_EXISTS }
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  await db.user.create({
    data: { name, email, password: hashedPassword },
  })

  void sendWelcomeEmail({ name, email })
    .catch((error) => {
      console.error("welcome_email_failed", {
        event: "welcome_email_failed",
        reason: "async_dispatch_exception",
        to: email,
        error,
      })
    })

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/?welcome=1",
    })
    return { success: true, redirectTo: "/?welcome=1" }
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: AUTH_MESSAGES.INVALID_CREDENTIALS }
    }
    throw error
  }
}
