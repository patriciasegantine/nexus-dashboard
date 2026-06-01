/**
 * @jest-environment node
 */

import { authConfig } from "@/auth/config"

jest.mock("next-auth/providers/google", () =>
  jest.fn(() => ({
    id: "google",
    name: "Google",
    type: "oauth",
  }))
)

describe("middleware authorization behavior", () => {
  const authorized = authConfig.callbacks?.authorized

  it("redirects unauthenticated users from protected routes to /login", async () => {
    const result = await authorized?.({
      auth: null,
      request: { nextUrl: new URL("http://localhost/board") },
    } as never)

    expect(result).toBeInstanceOf(Response)
    expect((result as Response).headers.get("location")).toBe("http://localhost/login")
  })

  it("allows unauthenticated users on public auth routes", async () => {
    const result = await authorized?.({
      auth: null,
      request: { nextUrl: new URL("http://localhost/login") },
    } as never)

    expect(result).toBe(true)
  })

  it("redirects authenticated users away from auth pages to /", async () => {
    const result = await authorized?.({
      auth: { user: { id: "user-1" } },
      request: { nextUrl: new URL("http://localhost/register") },
    } as never)

    expect(result).toBeInstanceOf(Response)
    expect((result as Response).headers.get("location")).toBe("http://localhost/")
  })
})
