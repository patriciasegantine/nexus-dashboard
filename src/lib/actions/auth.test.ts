import { loginUser, registerUser } from "@/lib/actions/auth"
import { AUTH_MESSAGES } from "@/constants/messages"
import { AuthError } from "next-auth"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { signIn } from "@/auth"
import { sendWelcomeEmail } from "@/lib/email"

jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(),
  })),
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

describe("auth server actions", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("registerUser", () => {
    it("returns success true for valid registration data", async () => {
      ;(db.user.findUnique as jest.Mock).mockResolvedValue(null)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password")
      ;(db.user.create as jest.Mock).mockResolvedValue({
        id: "user-1",
        name: "Patricia",
        email: "patricia@example.com",
      })
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
        expect.objectContaining({
          email: "patricia@example.com",
          redirectTo: "/?welcome=1",
        })
      )
    })

    it("returns proper error when email already exists", async () => {
      ;(db.user.findUnique as jest.Mock).mockResolvedValue({
        id: "existing-user",
        email: "patricia@example.com",
      })

      const formData = new FormData()
      formData.set("name", "Patricia Segantine")
      formData.set("email", "patricia@example.com")
      formData.set("password", "Strong@123")
      formData.set("confirmPassword", "Strong@123")

      const result = await registerUser({ success: false }, formData)

      expect(result).toEqual({
        success: false,
        error: AUTH_MESSAGES.USER_ALREADY_EXISTS,
      })
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

  describe("loginUser", () => {
    it("returns success true for valid credentials", async () => {
      ;(signIn as jest.Mock).mockResolvedValue(undefined)

      const formData = new FormData()
      formData.set("email", "patricia@example.com")
      formData.set("password", "Strong@123")

      const result = await loginUser({ success: false }, formData)

      expect(result).toEqual({ success: true })
      expect(signIn).toHaveBeenCalledWith(
        "credentials",
        expect.objectContaining({
          email: "patricia@example.com",
          redirectTo: "/",
        })
      )
    })

    it("returns invalid credentials error for wrong password", async () => {
      ;(signIn as jest.Mock).mockRejectedValue(new AuthError("CredentialsSignin"))

      const formData = new FormData()
      formData.set("email", "patricia@example.com")
      formData.set("password", "WrongPass@123")

      const result = await loginUser({ success: false }, formData)

      expect(result).toEqual({
        success: false,
        error: AUTH_MESSAGES.INVALID_CREDENTIALS,
      })
    })

    it("returns invalid credentials error for nonexistent email", async () => {
      ;(signIn as jest.Mock).mockRejectedValue(new AuthError("CredentialsSignin"))

      const formData = new FormData()
      formData.set("email", "missing@example.com")
      formData.set("password", "Strong@123")

      const result = await loginUser({ success: false }, formData)

      expect(result).toEqual({
        success: false,
        error: AUTH_MESSAGES.INVALID_CREDENTIALS,
      })
    })

    it("returns validation error for invalid email format", async () => {
      const formData = new FormData()
      formData.set("email", "not-an-email")
      formData.set("password", "Strong@123")

      const result = await loginUser({ success: false }, formData)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      expect(signIn).not.toHaveBeenCalled()
    })

    it("re-throws non-AuthError exceptions", async () => {
      ;(signIn as jest.Mock).mockRejectedValue(new Error("NEXT_REDIRECT"))

      const formData = new FormData()
      formData.set("email", "patricia@example.com")
      formData.set("password", "Strong@123")

      await expect(loginUser({ success: false }, formData)).rejects.toThrow("NEXT_REDIRECT")
    })
  })
})
