import { buildWelcomeEmailTemplate } from "@/lib/mail/templates/welcome-email"

type WelcomeEmailInput = {
  name: string
  email: string
}

export async function sendWelcomeEmail({ name, email }: WelcomeEmailInput): Promise<boolean> {
  const webhookUrl = process.env.EMAIL_WEBHOOK_URL
    ?? (process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/webhooks/email` : undefined)
  const webhookToken = process.env.EMAIL_WEBHOOK_TOKEN

  if (!webhookUrl) {
    console.warn("Email webhook URL is not set. Configure EMAIL_WEBHOOK_URL or NEXTAUTH_URL.")
    return false
  }

  try {
    const template = buildWelcomeEmailTemplate(name)

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(webhookToken ? { Authorization: `Bearer ${webhookToken}` } : {}),
      },
      body: JSON.stringify({
        type: "WELCOME_EMAIL",
        to: email,
        payload: {
          name,
        },
        subject: template.subject,
        text: template.text,
        html: template.html,
      }),
    })

    if (!response.ok) {
      console.error("Failed to send welcome email:", response.status, response.statusText)
      return false
    }

    return true
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return false
  }
}
