/** @jest-environment node */
import { loginUser } from "@/actions/auth"
import { AUTH_MESSAGES } from "@/constants/messages"
import { AuthError } from "next-auth"
import { signIn } from "@/auth"

jest.mock("next-auth", () => ({
  AuthError: class AuthError extends Error {},
}))

jest.mock("@/auth", () => ({
  signIn: jest.fn(),
}))

describe("loginUser", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns success for valid credentials", async () => {
    ;(signIn as jest.Mock).mockResolvedValue(undefined)

    const formData = new FormData()
    formData.set("email", "patricia@example.com")
    formData.set("password", "Strong@123")

    const result = await loginUser({ success: false }, formData)

    expect(result).toEqual({ success: true })
    expect(signIn).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({ email: "patricia@example.com", redirectTo: "/" })
    )
  })

  it("returns error for wrong password", async () => {
    ;(signIn as jest.Mock).mockRejectedValue(new AuthError("CredentialsSignin"))

    const formData = new FormData()
    formData.set("email", "patricia@example.com")
    formData.set("password", "WrongPass@123")

    const result = await loginUser({ success: false }, formData)

    expect(result).toEqual({ success: false, error: AUTH_MESSAGES.INVALID_CREDENTIALS })
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
