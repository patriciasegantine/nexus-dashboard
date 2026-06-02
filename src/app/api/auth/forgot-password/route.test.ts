/** @jest-environment node */
import { POST } from "@/app/api/auth/forgot-password/route"
import { db } from "@/lib/db"
import { sendResetPasswordEmail } from "@/lib/email"
import { getClientIp, isRateLimited } from "@/lib/rate-limit"

jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(),
  })),
}))

jest.mock("@/lib/db", () => ({
  db: {
    user: {
      findUnique: jest.fn(),
    },
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
  getClientIp: jest.fn(),
  isRateLimited: jest.fn(),
}))

describe("POST /api/auth/forgot-password", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getClientIp as jest.Mock).mockReturnValue("127.0.0.1")
    ;(isRateLimited as jest.Mock).mockReturnValue({ limited: false })
  })

  it("creates token for existing email and returns generic success response", async () => {
    ;(db.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-1",
      name: "Patricia",
      email: "patricia@example.com",
      password: "hashed-password",
    })
    ;(db.verificationToken.deleteMany as jest.Mock).mockResolvedValue({ count: 1 })
    ;(db.verificationToken.create as jest.Mock).mockResolvedValue({})
    ;(sendResetPasswordEmail as jest.Mock).mockResolvedValue(true)

    const request = new Request("http://localhost/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "patricia@example.com" }),
      headers: { "Content-Type": "application/json" },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.status).toBe("success")
    expect(body.message).toContain("If an account exists")
    expect(db.verificationToken.create).toHaveBeenCalled()
    expect(sendResetPasswordEmail).toHaveBeenCalled()
  })

  it("returns the same generic response for nonexistent email", async () => {
    ;(db.user.findUnique as jest.Mock).mockResolvedValue(null)

    const request = new Request("http://localhost/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "missing@example.com" }),
      headers: { "Content-Type": "application/json" },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.status).toBe("success")
    expect(body.message).toContain("If an account exists")
    expect(db.verificationToken.create).not.toHaveBeenCalled()
    expect(sendResetPasswordEmail).not.toHaveBeenCalled()
  })

  it("blocks requests after rate limit is exceeded", async () => {
    ;(isRateLimited as jest.Mock).mockReturnValue({
      limited: true,
      retryAfterSeconds: 120,
    })

    const request = new Request("http://localhost/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "patricia@example.com" }),
      headers: { "Content-Type": "application/json" },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(429)
    expect(body.status).toBe("error")
    expect(body.code).toBe("RATE_LIMITED")
  })

  it("returns generic success for OAuth user without password (no token created)", async () => {
    ;(db.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-1",
      name: "Patricia",
      email: "patricia@example.com",
      password: null,
    })

    const request = new Request("http://localhost/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "patricia@example.com" }),
      headers: { "Content-Type": "application/json" },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.status).toBe("success")
    expect(body.message).toContain("If an account exists")
    expect(db.verificationToken.create).not.toHaveBeenCalled()
    expect(sendResetPasswordEmail).not.toHaveBeenCalled()
  })

  it("returns 400 for invalid email format", async () => {
    const request = new Request("http://localhost/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "not-an-email" }),
      headers: { "Content-Type": "application/json" },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.status).toBe("error")
    expect(db.user.findUnique).not.toHaveBeenCalled()
  })
})
