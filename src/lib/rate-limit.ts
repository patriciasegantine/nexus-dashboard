type RateLimitEntry = {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number
): { limited: boolean; retryAfterSeconds?: number } {
  const now = Date.now()
  const current = store.get(key)

  if (!current || now > current.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { limited: false }
  }

  if (current.count >= limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000))
    return { limited: true, retryAfterSeconds }
  }

  current.count += 1
  store.set(key, current)
  return { limited: false }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown"
  }
  return request.headers.get("x-real-ip") || "unknown"
}
