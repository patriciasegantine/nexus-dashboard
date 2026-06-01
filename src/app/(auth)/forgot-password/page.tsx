"use client"

import React, { useState } from "react"
import Link from "next/link"
import { AppRoutes } from "@/constants/routes"
import { ApiRoutes } from "@/constants/api-routes"
import { AUTH_MESSAGES } from "@/constants/messagens"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { INVALID_INPUT_CLASS } from "@/lib/form-styles"
import { isValidEmail, normalizeEmail } from "@/lib/validators/email"
import { AuthFormShell } from "@/components/auth/auth-form-shell"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const trimmedEmail = normalizeEmail(email)
  const isEmailValid = isValidEmail(trimmedEmail)
  const showEmailError = email.length > 0 && !isEmailValid

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSuccess(false)

    if (!isEmailValid) {
      setError(AUTH_MESSAGES.INVALID_EMAIL)
      return
    }

    setIsPending(true)

    try {
      const response = await fetch(ApiRoutes.AUTH.FORGOT_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data?.message ?? "Unable to process request.")
        return
      }

      setIsSuccess(true)
    } catch {
      setError("Unable to process request. Please try again.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AuthFormShell
      title="Forgot your password?"
      subtitle="Enter your email and we'll send reset instructions."
    >

        {isSuccess ? (
          <div className="space-y-4">
            <p className="text-sm text-emerald-600">Reset email sent successfully.</p>
            <Button
              type="button"
              variant="outline"
              className="w-full h-12"
              onClick={() => {
                setError("")
                setIsSuccess(false)
              }}
            >
              Send another link
            </Button>
            
            <Link href={AppRoutes.AUTH.LOGIN} className="block pt-1">
              <Button type="button" className="w-full h-12">
                Continue to sign in
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className={cn("h-12", showEmailError && INVALID_INPUT_CLASS)}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              {showEmailError && (
                <p className="text-sm text-destructive">{AUTH_MESSAGES.INVALID_EMAIL}</p>
              )}
            </div>

            {error && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full h-12" disabled={isPending || !isEmailValid}>
              {isPending ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        )}

        {!isSuccess && (
          <div className="pt-6 text-center">
            <Link
              href={AppRoutes.AUTH.LOGIN}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to sign in
            </Link>
          </div>
        )}
    </AuthFormShell>
  )
}
