import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"
/**
 * Middleware uses ONLY authConfig (no database imports).
 * This keeps the Edge Runtime bundle free of Node.js modules (pg, crypto, etc).
 * Route protection logic lives in authConfig.callbacks.authorized.
 */
export const { auth: middleware } = NextAuth(authConfig)
export const config = {
  matcher: [
    /*
     * Apply middleware to all routes except:
     * - /api/auth (Auth.js internal routes)
     * - /_next/static, /_next/image (Next.js assets)
     * - public static files (favicon, images, etc.)
     */
    "/((?!api/auth|_next/static|_next/image|favicon\\.ico|site\\.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|webmanifest|txt|xml)$).*)",
  ],
}
