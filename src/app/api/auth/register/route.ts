import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { registerSchema } from "@/validations/auth"
import { AUTH_ERROR_CODES } from "@/constants/erros"
import { AUTH_MESSAGES } from "@/constants/messagens"
import { apiError, apiSuccess } from "@/lib/api/response"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return apiError(
        AUTH_ERROR_CODES.INVALID_CREDENTIALS,
        parsed.error.errors[0].message,
        400
      )
    }

    const name = parsed.data.name.trim()
    const email = parsed.data.email.trim().toLowerCase()
    const { password } = parsed.data

    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) {
      return apiError(
        AUTH_ERROR_CODES.USER_ALREADY_EXISTS,
        AUTH_MESSAGES.USER_ALREADY_EXISTS,
        409
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await db.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true },
    })

    return apiSuccess(
      { user },
      AUTH_MESSAGES.REGISTER_SUCCESS,
      201
    )
  } catch {
    return apiError("INTERNAL_SERVER_ERROR", "Internal server error", 500)
  }
}
