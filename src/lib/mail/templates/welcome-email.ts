export type EmailTemplate = {
  subject: string
  text: string
  html: string
}

export function buildWelcomeEmailTemplate(name: string): EmailTemplate {
  const safeName = name.trim() || "there"
  const subject = "Welcome! Your account has been created"

  const text = [
    `Hi ${safeName},`,
    "",
    "Your Nexus Dashboard account has been created successfully.",
    "You can now sign in and start using the platform.",
    "",
    "If you did not create this account, please reply to this email or contact support.",
  ].join("\n")

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin: 0 0 16px;">Hi ${safeName},</h2>
      <p>Your <strong>Nexus Dashboard</strong> account has been created successfully.</p>
      <p>You can now sign in and start using the platform.</p>
      <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">
        If you did not create this account, please reply to this email or contact support.
      </p>
    </div>
  `.trim()

  return { subject, text, html }
}
