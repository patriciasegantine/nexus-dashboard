import { buildWelcomeEmailTemplate } from "@/lib/mail/templates/welcome-email"
import nodemailer from "nodemailer"

type WelcomeEmailInput = {
  name: string
  email: string
}

export async function sendWelcomeEmail({ name, email }: WelcomeEmailInput): Promise<boolean> {
  const gmailUser = process.env.GMAIL_USER
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD
  const from = process.env.EMAIL_FROM

  if (!gmailUser || !gmailAppPassword || !from) {
    console.error("welcome_email_failed", {
      event: "welcome_email_failed",
      reason: "missing_gmail_smtp_config",
      hasGmailUser: Boolean(gmailUser),
      hasGmailAppPassword: Boolean(gmailAppPassword),
      hasEmailFrom: Boolean(from),
      to: email,
    })
    return false
  }

  try {
    const template = buildWelcomeEmailTemplate(name)
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
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    })
    return true
  } catch (error) {
    console.error("welcome_email_failed", {
      event: "welcome_email_failed",
      reason: "unexpected_exception",
      to: email,
      error,
    })
    return false
  }
}
