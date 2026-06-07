"use client"

import { useActionState } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { AppRoutes } from "@/constants/routes"
import { AUTH_MESSAGES } from "@/constants/messages"
import { loginUser } from "@/actions/auth"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { INVALID_INPUT_CLASS } from "@/lib/form-styles"
import { isValidEmail, normalizeEmail } from "@/lib/validators/email"
import { AuthFormShell } from "@/components/auth/auth-form-shell"
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"

const initialState = { success: false, error: undefined }

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginUser, initialState)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")

  const trimmedEmail = normalizeEmail(email)
  const isEmailValid = isValidEmail(trimmedEmail)
  const showEmailError = email.length > 0 && !isEmailValid

  return (
    <AuthFormShell title="Welcome back" subtitle="Sign in to your account to continue">

        {/* Email/Password */}
        <form action={action} className="space-y-3" noValidate>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className={cn("h-10", showEmailError && INVALID_INPUT_CLASS)}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
            {showEmailError && (
              <p className="text-sm text-destructive">{AUTH_MESSAGES.INVALID_EMAIL}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-10 pr-11"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <Link
              href={AppRoutes.AUTH.FORGOT_PASSWORD}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <Button type="submit" className="w-full h-10" disabled={isPending || !isEmailValid}>
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        {/* Google */}
        <GoogleSignInButton />

        <div className="text-center">
          <Link
            href={AppRoutes.AUTH.REGISTER}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Don&apos;t have an account? Sign up
          </Link>
        </div>
    </AuthFormShell>
  )
}
