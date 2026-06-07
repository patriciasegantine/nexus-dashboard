"use client"

import { useActionState } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { registerUser } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { AppRoutes } from "@/constants/routes"
import { AUTH_MESSAGES } from "@/constants/messages"
import { useRouter } from "next/navigation"
import { RegisterPasswordFields } from "@/app/(auth)/register/components/register-password-fields"
import { cn } from "@/lib/utils"
import { INVALID_INPUT_CLASS } from "@/lib/form-styles"
import { isStrongPassword } from "@/lib/password"
import { isValidEmail, normalizeEmail } from "@/lib/validators/email"
import { AuthFormShell } from "@/components/auth/auth-form-shell"
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"

const initialState = { success: false, error: undefined }

export default function RegisterPage() {
  const router = useRouter()
  const [state, action, isPending] = useActionState(registerUser, initialState)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const trimmedName = name.trim()
  const trimmedEmail = normalizeEmail(email)
  const isNameValid = trimmedName.length >= 3
  const isEmailValid = isValidEmail(trimmedEmail)
  const isPasswordValid = isStrongPassword(password)
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword
  const canSubmit =
    isNameValid
    && isEmailValid
    && isPasswordValid
    && confirmPassword.length > 0
    && !passwordMismatch

  const showNameError = name.length > 0 && !isNameValid
  const showEmailError = email.length > 0 && !isEmailValid

  useEffect(() => {
    if (state.success && state.redirectTo) {
      router.push(state.redirectTo)
    }
  }, [router, state.redirectTo, state.success])

  return (
    <AuthFormShell title="Create an account" subtitle="Enter your details to get started">

        <form action={action} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="your name"
              className={cn("h-10", showNameError && "border-destructive focus-visible:ring-destructive")}
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              autoFocus
              required
            />
            {showNameError && (
              <p className="text-sm text-destructive">Name must be at least 3 characters.</p>
            )}
          </div>
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
          <RegisterPasswordFields
            password={password}
            confirmPassword={confirmPassword}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            passwordMismatch={passwordMismatch}
            passwordInvalid={password.length > 0 && !isPasswordValid}
          />

          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <Button type="submit" className="w-full h-10" disabled={isPending || !canSubmit}>
            {isPending ? "Creating account..." : "Sign up"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <GoogleSignInButton />

        <div className="text-center">
          <Link
            href={AppRoutes.AUTH.LOGIN}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Already have an account? Sign in
          </Link>
        </div>
    </AuthFormShell>
  )
}
