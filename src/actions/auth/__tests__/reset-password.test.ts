/** @jest-environment node */
import { resetPassword } from "@/actions/auth"
import { AUTH_MESSAGES } from "@/constants/messages"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
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

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}))

jest.mock("@/lib/db", () => ({
  db: {
    user: { findUnique: jest.fn(), update: jest.fn() },
    verificationToken: { findUnique: jest.fn(), deleteMany: jest.fn() },
    $transaction: jest.fn(),
  },
}))

jest.mock("@/lib/rate-limit", () => ({
  isRateLimited: jest.fn(),
}))

describe("resetPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(isRateLimited as jest.Mock).mockReturnValue({ limited: false })
  })

  it("updates password successfully with valid token", async () => {
    ;(db.verificationToken.findUnique as jest.Mock).mockResolvedValue({
      identifier: "patricia@example.com",
      token: "hashed-token",
      expires: new Date(Date.now() + 60_000),
    })
    ;(db.user.findUnique as jest.Mock).mockResolvedValue({ id: "user-1", password: "old-hashed" })
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)
    ;(bcrypt.hash as jest.Mock).mockResolvedValue("new-hashed")
    ;(db.$transaction as jest.Mock).mockResolvedValue([])

    const formData = new FormData()
    formData.set("token", "valid-token")
    formData.set("newPassword", "Strong@123")
    formData.set("confirmPassword", "Strong@123")

    const result = await resetPassword({ success: false }, formData)

    expect(result.success).toBe(true)
    expect(db.$transaction).toHaveBeenCalled()
  })

  it("returns error for expired token", async () => {
    ;(db.verificationToken.findUnique as jest.Mock).mockResolvedValue({
      identifier: "patricia@example.com",
      token: "hashed-token",
      expires: new Date(Date.now() - 60_000),
    })

    const formData = new FormData()
    formData.set("token", "expired-token")
    formData.set("newPassword", "Strong@123")
    formData.set("confirmPassword", "Strong@123")

    const result = await resetPassword({ success: false }, formData)

    expect(result.success).toBe(false)
    expect(result.error).toBe(AUTH_MESSAGES.INVALID_RESET_LINK)
  })

  it("returns error for nonexistent token", async () => {
    ;(db.verificationToken.findUnique as jest.Mock).mockResolvedValue(null)

    const formData = new FormData()
    formData.set("token", "missing-token")
    formData.set("newPassword", "Strong@123")
    formData.set("confirmPassword", "Strong@123")

    const result = await resetPassword({ success: false }, formData)

    expect(result.success).toBe(false)
    expect(result.error).toBe(AUTH_MESSAGES.INVALID_RESET_LINK)
  })

  it("returns error when new password is same as current", async () => {
    ;(db.verificationToken.findUnique as jest.Mock).mockResolvedValue({
      identifier: "patricia@example.com",
      token: "hashed-token",
      expires: new Date(Date.now() + 60_000),
    })
    ;(db.user.findUnique as jest.Mock).mockResolvedValue({ id: "user-1", password: "old-hashed" })
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

    const formData = new FormData()
    formData.set("token", "valid-token")
    formData.set("newPassword", "Strong@123")
    formData.set("confirmPassword", "Strong@123")

    const result = await resetPassword({ success: false }, formData)

    expect(result.success).toBe(false)
    expect(result.error).toBe(AUTH_MESSAGES.SAME_PASSWORD)
    expect(db.$transaction).not.toHaveBeenCalled()
  })

  it("returns error for OAuth user without password", async () => {
    ;(db.verificationToken.findUnique as jest.Mock).mockResolvedValue({
      identifier: "patricia@example.com",
      token: "hashed-token",
      expires: new Date(Date.now() + 60_000),
    })
    ;(db.user.findUnique as jest.Mock).mockResolvedValue({ id: "user-1", password: null })

    const formData = new FormData()
    formData.set("token", "valid-token")
    formData.set("newPassword", "Strong@123")
    formData.set("confirmPassword", "Strong@123")

    const result = await resetPassword({ success: false }, formData)

    expect(result.success).toBe(false)
    expect(result.error).toBe(AUTH_MESSAGES.INVALID_RESET_LINK)
    expect(db.$transaction).not.toHaveBeenCalled()
  })

  it("returns error when rate limited", async () => {
    ;(isRateLimited as jest.Mock).mockReturnValue({ limited: true, retryAfterSeconds: 60 })

    const formData = new FormData()
    formData.set("token", "any-token")
    formData.set("newPassword", "Strong@123")
    formData.set("confirmPassword", "Strong@123")

    const result = await resetPassword({ success: false }, formData)

    expect(result.success).toBe(false)
    expect(result.error).toContain("Too many requests")
    expect(db.verificationToken.findUnique).not.toHaveBeenCalled()
  })

  it("returns error for weak password", async () => {
    const formData = new FormData()
    formData.set("token", "any-token")
    formData.set("newPassword", "weakpassword")
    formData.set("confirmPassword", "weakpassword")

    const result = await resetPassword({ success: false }, formData)

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
    expect(db.verificationToken.findUnique).not.toHaveBeenCalled()
  })
})
