import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

/**
 * Lightweight auth config — NO database imports.
 * Safe to use in Edge Runtime (middleware).
 */
export const authConfig = {
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isPublicRoute = nextUrl.pathname.startsWith("/login")

      // Logged-in user trying to access /login → redirect to dashboard
      if (isLoggedIn && isPublicRoute) {
        return Response.redirect(new URL("/", nextUrl))
      }

      // Unauthenticated user trying to access protected route → redirect to /login
      if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/login", nextUrl))
      }

      return true
    },
  },
} satisfies NextAuthConfig
