export type EmailTemplate = {
  subject: string
  text: string
  html: string
}

export function buildWelcomeEmailTemplate(name: string, siteUrl: string): EmailTemplate {
  const safeName = name.trim() || "there"
  const normalizedSiteUrl = siteUrl.replace(/\/+$/, "")
  const logoUrl = `${normalizedSiteUrl}/logo.svg`
  const loginUrl = `${normalizedSiteUrl}/login`
  const subject = "Welcome! Your account has been created"

  const text = [
    `Hi ${safeName},`,
    "",
    "Your Nexus Dashboard account has been created successfully.",
    "You can now sign in and start using the platform:",
    loginUrl,
    "",
    `Site: ${normalizedSiteUrl}`,
    "",
    "If you did not create this account, please reply to this email or contact support.",
  ].join("\n")

  const html = `
    <div style="background:#0b1020;padding:32px 16px;font-family:Inter,Arial,sans-serif;line-height:1.6;color:#e5e7eb;">
      <div style="max-width:620px;margin:0 auto;background:#111827;border:1px solid #1f2937;border-radius:14px;overflow:hidden;">
        <div style="padding:20px 24px;border-bottom:1px solid #1f2937;display:flex;align-items:center;gap:12px;">
          <img src="${logoUrl}" alt="Nexus Dashboard" width="34" height="34" style="display:block;border-radius:8px;background:#ffffff;padding:4px;" />
          <div style="font-size:18px;font-weight:700;color:#f9fafb;">Nexus Dashboard</div>
        </div>

        <div style="padding:28px 24px 24px;">
          <h2 style="margin:0 0 12px;color:#f9fafb;font-size:30px;font-style:italic;">Hi ${safeName},</h2>
          <p style="margin:0 0 10px;">Your <strong>Nexus Dashboard</strong> account has been created successfully.</p>
          <p style="margin:0 0 20px;">You can now sign in and start using the platform.</p>
          <p style="margin:0 0 18px;">
            <a href="${loginUrl}" style="display:inline-block;padding:11px 16px;border-radius:10px;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;">
              Access Nexus Dashboard
            </a>
          </p>
          <p style="margin:0 0 20px;font-size:14px;color:#93c5fd;">
            Site: <a href="${normalizedSiteUrl}" style="color:#93c5fd;text-decoration:none;">${normalizedSiteUrl}</a>
          </p>
          <p style="margin:0;font-size:14px;color:#9ca3af;">
            If you did not create this account, please reply to this email or contact support.
          </p>
        </div>
      </div>
    </div>
  `.trim()

  return { subject, text, html }
}
