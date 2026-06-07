"use server"

import bcrypt from "bcryptjs"
import crypto from "node:crypto"
import { headers } from "next/headers"
import { AuthError } from "next-auth"
import { db } from "@/lib/db"
import { signIn } from "@/auth"
import { AUTH_MESSAGES } from "@/constants/messages"
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "@/validations/auth"
import { sendWelcomeEmail, sendResetPasswordEmail } from "@/lib/email"
import { isRateLimited } from "@/lib/rate-limit"
import { getBaseUrl } from "@/lib/base-url"

export type ForgotPasswordState = {
  success: boolean
  error?: string
  rateLimited?: boolean
  retryAfterSeconds?: number
}

export type ResetPasswordState = {
  success: boolean
  error?: string
}

export type RegisterState = {
  success: boolean
  error?: string
  redirectTo?: string
}

export type LoginState = {
  success: boolean
  error?: string
}

export async function requestPasswordReset(
  _prev: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"

  const rateLimit = isRateLimited(`forgot-password:${ip}`, 5, 15 * 60 * 1000)
  if (rateLimit.limited) {
    return {
      success: false,
      rateLimited: true,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
      error: `Too many requests. Try again in ${rateLimit.retryAfterSeconds}s.`,
    }
  }

  const raw = { email: formData.get("email") }
  const parsed = forgotPasswordSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const email = parsed.data.email.trim().toLowerCase()
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, password: true },
  })

  if (!user || !user.password) {
    return { success: true }
  }

  await db.verificationToken.deleteMany({ where: { identifier: email } })

  const rawToken = crypto.randomBytes(32).toString("hex")
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex")
  const expires = new Date(Date.now() + 1000 * 60 * 30)

  await db.verificationToken.create({
    data: { identifier: email, token: hashedToken, expires },
  })

  const baseUrl = getBaseUrl()
  const resetLink = `${baseUrl}/reset-password?token=${rawToken}`

  await sendResetPasswordEmail({
    name: user.name?.trim() || "there",
    email,
    resetLink,
  })

  return { success: true }
}

export async function resetPassword(
  _prev: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"

  const rateLimit = isRateLimited(`reset-password:${ip}`, 10, 15 * 60 * 1000)
  if (rateLimit.limited) {
    return {
      success: false,
      error: `Too many requests. Try again in ${rateLimit.retryAfterSeconds}s.`,
    }
  }

  const raw = {
    token: formData.get("token"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  }

  const parsed = resetPasswordSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const { token, newPassword } = parsed.data
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

  const verificationToken = await db.verificationToken.findUnique({
    where: { token: hashedToken },
  })

  if (!verificationToken || verificationToken.expires < new Date()) {
    return { success: false, error: AUTH_MESSAGES.INVALID_RESET_LINK }
  }

  const user = await db.user.findUnique({
    where: { email: verificationToken.identifier },
    select: { id: true, password: true },
  })

  if (!user || !user.password) {
    return { success: false, error: AUTH_MESSAGES.INVALID_RESET_LINK }
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password)
  if (isSamePassword) {
    return { success: false, error: AUTH_MESSAGES.SAME_PASSWORD }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12)

  await db.$transaction([
    db.user.update({ where: { id: user.id }, data: { password: hashedPassword } }),
    db.verificationToken.deleteMany({ where: { identifier: verificationToken.identifier } }),
  ])

  return { success: true }
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
      redirectTo: "/",
    })
    return { success: true, redirectTo: "/?welcome=1" }
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: AUTH_MESSAGES.INVALID_CREDENTIALS }
    }
    throw error
  }
}
