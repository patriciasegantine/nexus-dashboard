/** @jest-environment node */
import { registerUser } from "@/actions/auth"
import { AUTH_MESSAGES } from "@/constants/messages"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { signIn } from "@/auth"
import { sendWelcomeEmail } from "@/lib/email"

jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({ sendMail: jest.fn() })),
}))

jest.mock("next-auth", () => ({
  AuthError: class AuthError extends Error {},
}))

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}))

jest.mock("@/lib/db", () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

jest.mock("@/auth", () => ({
  signIn: jest.fn(),
}))

jest.mock("@/lib/email", () => ({
  sendWelcomeEmail: jest.fn(),
}))

describe("registerUser", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns success for valid registration data", async () => {
    ;(db.user.findUnique as jest.Mock).mockResolvedValue(null)
    ;(bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password")
    ;(db.user.create as jest.Mock).mockResolvedValue({ id: "user-1", name: "Patricia", email: "patricia@example.com" })
    ;(signIn as jest.Mock).mockResolvedValue(undefined)
    ;(sendWelcomeEmail as jest.Mock).mockResolvedValue(true)

    const formData = new FormData()
    formData.set("name", "Patricia Segantine")
    formData.set("email", "patricia@example.com")
    formData.set("password", "Strong@123")
    formData.set("confirmPassword", "Strong@123")

    const result = await registerUser({ success: false }, formData)

    expect(result.success).toBe(true)
    expect(signIn).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({ email: "patricia@example.com", redirectTo: "/?welcome=1" })
    )
  })

  it("returns error when email already exists", async () => {
    ;(db.user.findUnique as jest.Mock).mockResolvedValue({ id: "existing-user" })

    const formData = new FormData()
    formData.set("name", "Patricia Segantine")
    formData.set("email", "patricia@example.com")
    formData.set("password", "Strong@123")
    formData.set("confirmPassword", "Strong@123")

    const result = await registerUser({ success: false }, formData)

    expect(result).toEqual({ success: false, error: AUTH_MESSAGES.USER_ALREADY_EXISTS })
    expect(db.user.create).not.toHaveBeenCalled()
  })

  it("fails validation for weak password", async () => {
    const formData = new FormData()
    formData.set("name", "Patricia")
    formData.set("email", "patricia@example.com")
    formData.set("password", "12345678")
    formData.set("confirmPassword", "12345678")

    const result = await registerUser({ success: false }, formData)

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
    expect(db.user.findUnique).not.toHaveBeenCalled()
  })

  it("fails validation when required fields are missing", async () => {
    const formData = new FormData()
    formData.set("email", "patricia@example.com")
    formData.set("password", "Strong@123")

    const result = await registerUser({ success: false }, formData)

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
    expect(db.user.findUnique).not.toHaveBeenCalled()
  })
})
