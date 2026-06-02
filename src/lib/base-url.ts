export function getBaseUrl(request?: Request): string {
  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (configuredAppUrl) {
    return configuredAppUrl
  }

  const vercelUrl = process.env.VERCEL_URL?.trim()
  if (vercelUrl) {
    return `https://${vercelUrl}`
  }

  if (request) {
    return new URL(request.url).origin
  }

  return "http://localhost:3000"
}
