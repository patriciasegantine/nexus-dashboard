/** @jest-environment node */
import { POST } from "@/app/api/auth/reset-password/route"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { getClientIp, isRateLimited } from "@/lib/rate-limit"

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}))

jest.mock("@/lib/db", () => ({
  db: {
    verificationToken: {
      findUnique: jest.fn(),
      deleteMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}))

jest.mock("@/lib/rate-limit", () => ({
  getClientIp: jest.fn(),
  isRateLimited: jest.fn(),
}))

describe("POST /api/auth/reset-password", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getClientIp as jest.Mock).mockReturnValue("127.0.0.1")
    ;(isRateLimited as jest.Mock).mockReturnValue({ limited: false })
  })

  it("updates password successfully with valid token", async () => {
    ;(db.verificationToken.findUnique as jest.Mock).mockResolvedValue({
      identifier: "patricia@example.com",
      token: "hashed-token",
      expires: new Date(Date.now() + 60_000),
    })
    ;(db.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-1",
      password: "old-hashed-password",
    })
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)
    ;(bcrypt.hash as jest.Mock).mockResolvedValue("new-hashed-password")
    ;(db.$transaction as jest.Mock).mockResolvedValue([])

    const request = new Request("http://localhost/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: "valid-token",
        newPassword: "Strong@123",
        confirmPassword: "Strong@123",
      }),
      headers: { "Content-Type": "application/json" },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.status).toBe("success")
    expect(body.data.reset).toBe(true)
    expect(db.$transaction).toHaveBeenCalled()
  })

  it("returns error for expired token", async () => {
    ;(db.verificationToken.findUnique as jest.Mock).mockResolvedValue({
      identifier: "patricia@example.com",
      token: "hashed-token",
      expires: new Date(Date.now() - 60_000),
    })

    const request = new Request("http://localhost/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: "expired-token",
        newPassword: "Strong@123",
        confirmPassword: "Strong@123",
      }),
      headers: { "Content-Type": "application/json" },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.status).toBe("error")
    expect(body.code).toBe("INVALID_TOKEN")
  })

  it("returns error when new password is the same as current password", async () => {
    ;(db.verificationToken.findUnique as jest.Mock).mockResolvedValue({
      identifier: "patricia@example.com",
      token: "hashed-token",
      expires: new Date(Date.now() + 60_000),
    })
    ;(db.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-1",
      password: "old-hashed-password",
    })
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

    const request = new Request("http://localhost/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: "valid-token",
        newPassword: "Strong@123",
        confirmPassword: "Strong@123",
      }),
      headers: { "Content-Type": "application/json" },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.status).toBe("error")
    expect(body.code).toBe("SAME_PASSWORD")
  })

  it("returns error for nonexistent token", async () => {
    ;(db.verificationToken.findUnique as jest.Mock).mockResolvedValue(null)

    const request = new Request("http://localhost/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: "missing-token",
        newPassword: "Strong@123",
        confirmPassword: "Strong@123",
      }),
      headers: { "Content-Type": "application/json" },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.status).toBe("error")
    expect(body.code).toBe("INVALID_TOKEN")
  })

  it("blocks requests after rate limit is exceeded", async () => {
    ;(isRateLimited as jest.Mock).mockReturnValue({
      limited: true,
      retryAfterSeconds: 60,
    })

    const request = new Request("http://localhost/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: "any-token",
        newPassword: "Strong@123",
        confirmPassword: "Strong@123",
      }),
      headers: { "Content-Type": "application/json" },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(429)
    expect(body.status).toBe("error")
    expect(body.code).toBe("RATE_LIMITED")
  })

  it("returns INVALID_TOKEN when user is OAuth-only (no password)", async () => {
    ;(db.verificationToken.findUnique as jest.Mock).mockResolvedValue({
      identifier: "patricia@example.com",
      token: "hashed-token",
      expires: new Date(Date.now() + 60_000),
    })
    ;(db.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-1",
      password: null,
    })

    const request = new Request("http://localhost/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: "valid-token",
        newPassword: "Strong@123",
        confirmPassword: "Strong@123",
      }),
      headers: { "Content-Type": "application/json" },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.status).toBe("error")
    expect(body.code).toBe("INVALID_TOKEN")
    expect(db.$transaction).not.toHaveBeenCalled()
  })

  it("returns 400 for weak password that fails validation", async () => {
    const request = new Request("http://localhost/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: "any-token",
        newPassword: "weakpassword",
        confirmPassword: "weakpassword",
      }),
      headers: { "Content-Type": "application/json" },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.status).toBe("error")
    expect(db.verificationToken.findUnique).not.toHaveBeenCalled()
  })
})
