/** @jest-environment node */
import { requestPasswordReset } from "@/actions/auth"
import { db } from "@/lib/db"
import { sendResetPasswordEmail } from "@/lib/email"
import { isRateLimited } from "@/lib/rate-limit"

jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({ sendMail: jest.fn() })),
}))

jest.mock("next-auth", () => ({
  AuthError: class AuthError extends Error {},
}))

jest.mock("@/auth", () => ({
  signIn: jest.fn(),
}))

jest.mock("next/headers", () => ({
  headers: jest.fn().mockResolvedValue({
    get: jest.fn().mockReturnValue("127.0.0.1"),
  }),
}))

jest.mock("@/lib/db", () => ({
  db: {
    user: { findUnique: jest.fn() },
    verificationToken: {
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
  },
}))

jest.mock("@/lib/email", () => ({
  sendResetPasswordEmail: jest.fn(),
}))

jest.mock("@/lib/rate-limit", () => ({
  isRateLimited: jest.fn(),
}))

jest.mock("@/lib/base-url", () => ({
  getBaseUrl: jest.fn().mockReturnValue("http://localhost:3000"),
}))

describe("requestPasswordReset", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(isRateLimited as jest.Mock).mockReturnValue({ limited: false })
  })

  it("creates token and sends email for existing user", async () => {
    ;(db.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-1",
      name: "Patricia",
      email: "patricia@example.com",
      password: "hashed",
    })
    ;(db.verificationToken.deleteMany as jest.Mock).mockResolvedValue({})
    ;(db.verificationToken.create as jest.Mock).mockResolvedValue({})
    ;(sendResetPasswordEmail as jest.Mock).mockResolvedValue(true)

    const formData = new FormData()
    formData.set("email", "patricia@example.com")

    const result = await requestPasswordReset({ success: false }, formData)

    expect(result.success).toBe(true)
    expect(db.verificationToken.create).toHaveBeenCalled()
    expect(sendResetPasswordEmail).toHaveBeenCalled()
  })

  it("returns success for nonexistent email (anti-enumeration)", async () => {
    ;(db.user.findUnique as jest.Mock).mockResolvedValue(null)

    const formData = new FormData()
    formData.set("email", "missing@example.com")

    const result = await requestPasswordReset({ success: false }, formData)

    expect(result.success).toBe(true)
    expect(db.verificationToken.create).not.toHaveBeenCalled()
    expect(sendResetPasswordEmail).not.toHaveBeenCalled()
  })

  it("returns success for OAuth user without password (anti-enumeration)", async () => {
    ;(db.user.findUnique as jest.Mock).mockResolvedValue({ id: "user-1", email: "patricia@example.com", password: null })

    const formData = new FormData()
    formData.set("email", "patricia@example.com")

    const result = await requestPasswordReset({ success: false }, formData)

    expect(result.success).toBe(true)
    expect(db.verificationToken.create).not.toHaveBeenCalled()
  })

  it("returns rateLimited when rate limit exceeded", async () => {
    ;(isRateLimited as jest.Mock).mockReturnValue({ limited: true, retryAfterSeconds: 120 })

    const formData = new FormData()
    formData.set("email", "patricia@example.com")

    const result = await requestPasswordReset({ success: false }, formData)

    expect(result.success).toBe(false)
    expect(result.rateLimited).toBe(true)
    expect(result.retryAfterSeconds).toBe(120)
    expect(db.user.findUnique).not.toHaveBeenCalled()
  })

  it("returns error for invalid email format", async () => {
    const formData = new FormData()
    formData.set("email", "not-an-email")

    const result = await requestPasswordReset({ success: false }, formData)

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
    expect(db.user.findUnique).not.toHaveBeenCalled()
  })
})
