import bcrypt from "bcryptjs"
import crypto from "node:crypto"
import { resetPasswordSchema } from "@/validations/auth"
import { AUTH_ERROR_CODES } from "@/constants/errors"
import { AUTH_MESSAGES } from "@/constants/messages"
import { apiError, apiSuccess } from "@/lib/api/response"
import { db } from "@/lib/db"
import { getClientIp, isRateLimited } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const rateLimit = isRateLimited(`reset-password:${ip}`, 10, 15 * 60 * 1000)
    if (rateLimit.limited) {
      return apiError(
        "RATE_LIMITED",
        `Too many requests. Try again in ${rateLimit.retryAfterSeconds}s.`,
        429
      )
    }

    const body = await request.json()
    const parsed = resetPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return apiError(
        AUTH_ERROR_CODES.INVALID_TOKEN,
        parsed.error.errors[0].message,
        400
      )
    }

    const { token, newPassword } = parsed.data
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const verificationToken = await db.verificationToken.findUnique({
      where: { token: hashedToken },
    })

    if (!verificationToken || verificationToken.expires < new Date()) {
      return apiError(
        AUTH_ERROR_CODES.INVALID_TOKEN,
        AUTH_MESSAGES.INVALID_RESET_LINK,
        400
      )
    }

    const user = await db.user.findUnique({
      where: { email: verificationToken.identifier },
      select: { id: true, password: true },
    })

    if (!user || !user.password) {
      return apiError(
        AUTH_ERROR_CODES.INVALID_TOKEN,
        AUTH_MESSAGES.INVALID_RESET_LINK,
        400
      )
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password)
    if (isSamePassword) {
      return apiError(
        AUTH_ERROR_CODES.SAME_PASSWORD,
        AUTH_MESSAGES.SAME_PASSWORD,
        400
      )
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)

    await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      db.verificationToken.deleteMany({
        where: { identifier: verificationToken.identifier },
      }),
    ])

    return apiSuccess(
      { reset: true },
      AUTH_MESSAGES.RESET_PASSWORD_SUCCESS
    )
  } catch {
    return apiError("INTERNAL_SERVER_ERROR", "Internal server error", 500)
  }
}
