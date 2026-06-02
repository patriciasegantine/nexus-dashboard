import crypto from "node:crypto"
import { forgotPasswordSchema } from "@/validations/auth"
import { AUTH_ERROR_CODES } from "@/constants/errors"
import { AUTH_MESSAGES } from "@/constants/messages"
import { apiError, apiSuccess } from "@/lib/api/response"
import { db } from "@/lib/db"
import { sendResetPasswordEmail } from "@/lib/email"
import { getBaseUrl } from "@/lib/base-url"
import { getClientIp, isRateLimited } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const rateLimit = isRateLimited(`forgot-password:${ip}`, 5, 15 * 60 * 1000)
    if (rateLimit.limited) {
      return apiError(
        "RATE_LIMITED",
        `Too many requests. Try again in ${rateLimit.retryAfterSeconds}s.`,
        429
      )
    }

    const body = await request.json()
    const parsed = forgotPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return apiError(
        AUTH_ERROR_CODES.INVALID_CREDENTIALS,
        parsed.error.errors[0].message,
        400
      )
    }

    const email = parsed.data.email.trim().toLowerCase()
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true },
    })

    // Always return a generic message to avoid user enumeration.
    if (!user || !user.password) {
      return apiSuccess(
        { accepted: true },
        AUTH_MESSAGES.FORGOT_PASSWORD
      )
    }

    await db.verificationToken.deleteMany({
      where: { identifier: email },
    })

    const rawToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex")
    const expires = new Date(Date.now() + 1000 * 60 * 30) // 30 minutes

    await db.verificationToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires,
      },
    })

    const baseUrl = getBaseUrl(request)
    const resetLink = `${baseUrl}/reset-password?token=${rawToken}`

    await sendResetPasswordEmail({
      name: user.name?.trim() || "there",
      email,
      resetLink,
    })

    // Intentionally generic response to avoid user enumeration.
    return apiSuccess(
      { accepted: true },
      AUTH_MESSAGES.FORGOT_PASSWORD
    )
  } catch {
    return apiError("INTERNAL_SERVER_ERROR", "Internal server error", 500)
  }
}
