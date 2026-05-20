import { z } from "zod"
import { Resend } from "resend"
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

  const resendApiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  const welcomeTemplateId = process.env.RESEND_WELCOME_TEMPLATE_ID
  const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000"
  const supportEmail = process.env.SUPPORT_EMAIL ?? "support@nexus.app"
  const logoUrl = process.env.EMAIL_LOGO_URL ?? `${appUrl}/logo.png`

  if (!resendApiKey || !from) {
    return apiError(
      "EMAIL_PROVIDER_NOT_CONFIGURED",
      "RESEND_API_KEY and EMAIL_FROM must be configured.",
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
    const resend = new Resend(resendApiKey)
    const { error } = welcomeTemplateId
      ? await resend.emails.send({
        from,
        to,
        subject,
        template: {
          id: welcomeTemplateId,
          variables: {
            NAME: parsed.data.payload.name,
            APP_NAME: "Nexus Dashboard",
            LOGIN_URL: `${appUrl}/login`,
            LOGO_URL: logoUrl,
            SUPPORT_EMAIL: supportEmail,
            YEAR: String(new Date().getFullYear()),
          },
        },
      })
      : await resend.emails.send({
        from,
        to,
        subject,
        text,
        html,
      })

    if (error) {
      console.error("Resend error:", error)
      return apiError("EMAIL_SEND_FAILED", "Failed to send email.", 502)
    }

    return apiSuccess({ accepted: true }, "Email sent successfully.")
  } catch (error) {
    console.error("Email webhook internal error:", error)
    return apiError("INTERNAL_SERVER_ERROR", "Internal server error", 500)
  }
}
