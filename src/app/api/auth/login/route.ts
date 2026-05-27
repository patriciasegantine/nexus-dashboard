import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { loginSchema } from "@/validations/auth"
import { AUTH_ERROR_CODES } from "@/constants/erros"
import { AUTH_MESSAGES } from "@/constants/messagens"
import { apiError, apiSuccess } from "@/lib/api/response"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return apiError(
        AUTH_ERROR_CODES.INVALID_CREDENTIALS,
        parsed.error.errors[0].message,
        400
      )
    }

    const email = parsed.data.email.trim().toLowerCase()
    const { password } = parsed.data

    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true },
    })

    if (!user || !user.password) {
      return apiError(
        AUTH_ERROR_CODES.INVALID_CREDENTIALS,
        AUTH_MESSAGES.INVALID_CREDENTIALS,
        401
      )
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return apiError(
        AUTH_ERROR_CODES.INVALID_CREDENTIALS,
        AUTH_MESSAGES.INVALID_CREDENTIALS,
        401
      )
    }

    return apiSuccess(
      { user: { id: user.id, name: user.name, email: user.email } },
      AUTH_MESSAGES.LOGIN_SUCCESS
    )
  } catch {
    return apiError("INTERNAL_SERVER_ERROR", "Internal server error", 500)
  }
}
