import { z } from "zod"
import nodemailer from "nodemailer"
import { apiError, apiSuccess } from "@/lib/api/response"

const emailWebhookSchema = z.object({
  type: z.literal("WELCOME_EMAIL"),
  to: z.string().email(),
  subject: z.string().min(1),
  text: z.string().min(1),
  html: z.string().min(1),
  payload: z.object({
    name: z.string().min(1),
  }),
})

function isAuthorized(request: Request): boolean {
  const expectedToken = process.env.EMAIL_WEBHOOK_TOKEN
  if (!expectedToken) return true

  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) return false

  const token = authHeader.slice("Bearer ".length).trim()
  return token === expectedToken
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return apiError("UNAUTHORIZED", "Invalid webhook token.", 401)
  }

  const gmailUser = process.env.GMAIL_USER
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD
  const from = process.env.EMAIL_FROM

  if (!gmailUser || !gmailAppPassword || !from) {
    return apiError(
      "EMAIL_PROVIDER_NOT_CONFIGURED",
      "GMAIL_USER, GMAIL_APP_PASSWORD and EMAIL_FROM must be configured.",
      500
    )
  }

  try {
    const body = await request.json()
    const parsed = emailWebhookSchema.safeParse(body)

    if (!parsed.success) {
      return apiError("INVALID_PAYLOAD", parsed.error.errors[0].message, 400)
    }

    const { to, subject, text, html } = parsed.data
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    })

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    })

    return apiSuccess({ accepted: true }, "Email sent successfully.")
  } catch (error) {
    console.error("Email webhook internal error:", error)
    return apiError("INTERNAL_SERVER_ERROR", "Internal server error", 500)
  }
}
