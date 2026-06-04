"use client"

import React, { useState, useEffect, useRef, useTransition } from "react"
import Link from "next/link"
import { MailCheck } from "lucide-react"
import { AppRoutes } from "@/constants/routes"
import { AUTH_MESSAGES } from "@/constants/messages"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { INVALID_INPUT_CLASS } from "@/lib/form-styles"
import { isValidEmail, normalizeEmail } from "@/lib/validators/email"
import { AuthFormShell } from "@/components/auth/auth-form-shell"
import { requestPasswordReset } from "@/actions/auth"

const RESEND_COOLDOWN = 60

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [rateLimitMessage, setRateLimitMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isPending, startTransition] = useTransition()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const trimmedEmail = normalizeEmail(email)
  const isEmailValid = isValidEmail(trimmedEmail)
  const showEmailError = email.length > 0 && !isEmailValid

  useEffect(() => {
    if (!isSuccess) return

    setCountdown(RESEND_COOLDOWN)
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isSuccess])

  function handleSubmit(formData: FormData) {
    setError("")
    setRateLimitMessage("")
    setIsSuccess(false)

    if (!isEmailValid) {
      setError(AUTH_MESSAGES.INVALID_EMAIL)
      return
    }

    startTransition(async () => {
      const result = await requestPasswordReset({ success: false }, formData)

      if (result.rateLimited) {
        setRateLimitMessage(result.error ?? "Too many requests. Please wait before trying again.")
        return
      }

      if (!result.success) {
        setError(result.error ?? "Unable to process request.")
        return
      }

      setIsSuccess(true)
    })
  }

  function handleSendAnother() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setCountdown(0)
    setError("")
    setRateLimitMessage("")
    setIsSuccess(false)
  }

  return (
    <AuthFormShell
      title="Forgot your password?"
      subtitle="Enter your email and we'll send reset instructions."
    >
      {isSuccess ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
              <MailCheck className="h-6 w-6 text-emerald-500" />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium">Check your inbox</p>
              <p className="text-sm text-muted-foreground">
                If{" "}
                <span className="font-medium text-foreground">{trimmedEmail}</span>
                {" "}is registered with us, you&apos;ll receive a reset link shortly.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12"
              disabled={countdown > 0}
              onClick={handleSendAnother}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : "Send another link"}
            </Button>

            <Link href={AppRoutes.AUTH.LOGIN} className="block">
              <Button type="button" className="w-full h-12">
                Continue to sign in
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form action={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className={cn("h-12", showEmailError && INVALID_INPUT_CLASS)}
              value={email}
              onChange={(event) => { setEmail(event.target.value); setRateLimitMessage("") }}
              required
            />
            {showEmailError && (
              <p className="text-sm text-destructive">{AUTH_MESSAGES.INVALID_EMAIL}</p>
            )}
          </div>

          {rateLimitMessage && (
            <p className="rounded-md border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-sm font-medium text-amber-600 dark:text-amber-400">
              {rateLimitMessage}
            </p>
          )}

          {error && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full h-12" disabled={isPending || !isEmailValid || !!rateLimitMessage}>
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
