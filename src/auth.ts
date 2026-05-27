import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { authConfig } from "@/auth.config"
import { loginSchema } from "@/validations/auth"
import { sendWelcomeEmail } from "@/lib/email"

export const { handlers, auth, signIn } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    ...authConfig.providers,
    Credentials({
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const email = parsed.data.email.trim().toLowerCase()
        const { password } = parsed.data

        const user = await db.user.findUnique({ where: { email } })
        if (!user || !user.password) return null

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) return null

        return { id: user.id, name: user.name, email: user.email, image: user.image }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      return session
    },
  },
  events: {
    async createUser({ user }) {
      const email = user.email?.trim().toLowerCase()
      if (!email) return

      const name = user.name?.trim() || "there"
      void sendWelcomeEmail({ name, email }).catch((error) => {
        console.error("welcome_email_failed", {
          event: "welcome_email_failed",
          reason: "nextauth_create_user_event",
          to: email,
          error,
        })
      })
    },
  },
})
