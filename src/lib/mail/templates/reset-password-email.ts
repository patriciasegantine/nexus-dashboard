import type { EmailTemplate } from "@/lib/mail/templates/welcome-email"

export function buildResetPasswordEmailTemplate(name: string, resetLink: string): EmailTemplate {
  const safeName = name.trim() || "there"
  const subject = "Reset your password"

  const text = [
    `Hi ${safeName},`,
    "",
    "We received a request to reset your password.",
    "Use the link below to choose a new password:",
    resetLink,
    "",
    "If you did not request this, you can ignore this email.",
  ].join("\n")

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin: 0 0 16px;">Hi ${safeName},</h2>
      <p>We received a request to reset your password.</p>
      <p>
        <a href="${resetLink}" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#111827;color:#ffffff;text-decoration:none;">
          Reset password
        </a>
      </p>
      <p style="word-break: break-all; font-size: 14px; color: #4b5563;">
        ${resetLink}
      </p>
      <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
        If you did not request this, you can ignore this email.
      </p>
    </div>
  `.trim()

  return { subject, text, html }
}
