import { buildWelcomeEmailTemplate } from "@/lib/mail/templates/welcome-email"
import { buildResetPasswordEmailTemplate } from "@/lib/mail/templates/reset-password-email"
import { getBaseUrl } from "@/lib/base-url"
import nodemailer from "nodemailer"

type WelcomeEmailInput = {
  name: string
  email: string
}

type ResetPasswordEmailInput = {
  name: string
  email: string
  resetLink: string
}

function getEmailConfig() {
  const gmailUser = process.env.GMAIL_USER
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD
  const from = process.env.EMAIL_FROM

  return { gmailUser, gmailAppPassword, from }
}

function createTransporter(gmailUser: string, gmailAppPassword: string) {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  })
}

export async function sendWelcomeEmail({ name, email }: WelcomeEmailInput): Promise<boolean> {
  const { gmailUser, gmailAppPassword, from } = getEmailConfig()

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
    const template = buildWelcomeEmailTemplate(name, getBaseUrl())
    const transporter = createTransporter(gmailUser, gmailAppPassword)

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

export async function sendResetPasswordEmail({
  name,
  email,
  resetLink,
}: ResetPasswordEmailInput): Promise<boolean> {
  const { gmailUser, gmailAppPassword, from } = getEmailConfig()

  if (!gmailUser || !gmailAppPassword || !from) {
    console.error("reset_password_email_failed", {
      event: "reset_password_email_failed",
      reason: "missing_gmail_smtp_config",
      hasGmailUser: Boolean(gmailUser),
      hasGmailAppPassword: Boolean(gmailAppPassword),
      hasEmailFrom: Boolean(from),
      to: email,
    })
    return false
  }

  try {
    const template = buildResetPasswordEmailTemplate(name, resetLink)
    const transporter = createTransporter(gmailUser, gmailAppPassword)

    await transporter.sendMail({
      from,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    })
    return true
  } catch (error) {
    console.error("reset_password_email_failed", {
      event: "reset_password_email_failed",
      reason: "unexpected_exception",
      to: email,
      error,
    })
    return false
  }
}
