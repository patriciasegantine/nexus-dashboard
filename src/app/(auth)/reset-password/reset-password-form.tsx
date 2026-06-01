"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { ApiRoutes } from "@/constants/api-routes"
import { AppRoutes } from "@/constants/routes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordRules } from "@/components/password-rules"
import { usePasswordRules } from "@/hooks/use-password-rules"
import { AuthFormShell } from "@/components/auth/auth-form-shell"
import { INVALID_INPUT_CLASS } from "@/lib/form-styles"
import { cn } from "@/lib/utils"

type ResetPasswordFormProps = {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { showRules, setShowRules, passwordRules } = usePasswordRules(newPassword)

  const passwordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword
  const passwordRulesWithMatch = [
    ...passwordRules,
    {
      text: "passwords match",
      valid: confirmPassword.length > 0 && !passwordMismatch,
    },
  ]
  const completedRulesWithMatch = passwordRulesWithMatch.filter((rule) => rule.valid).length
  const passwordInvalid = newPassword.length > 0 && completedRulesWithMatch !== passwordRulesWithMatch.length
  const canSubmit =
    Boolean(token)
    && newPassword.length > 0
    && confirmPassword.length > 0
    && !passwordMismatch
    && !passwordInvalid

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage("")
    setError("")

    if (!token) {
      setError("Invalid password reset link.")
      return
    }

    if (passwordMismatch || passwordInvalid) {
      setError("Please fix the password validation errors.")
      return
    }

    setIsPending(true)

    try {
      const response = await fetch(ApiRoutes.AUTH.RESET_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword,
          confirmPassword,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data?.message ?? "Unable to reset password.")
        return
      }

      setMessage(data?.message ?? "Password reset successful. You can now sign in.")
      setNewPassword("")
      setConfirmPassword("")
      setIsSuccess(true)
    } catch {
      setError("Unable to reset password. Please try again.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AuthFormShell
      title="Reset your password"
      subtitle="Choose a new password to continue."
    >

        {!token ? (
          <div className="space-y-4 text-center">
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
              This reset link is invalid or has expired.
            </p>
            <Link
              href={AppRoutes.AUTH.FORGOT_PASSWORD}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Request a new reset link
            </Link>
          </div>
        ) : isSuccess ? (
            <div className="space-y-4">
              <p className="text-sm text-emerald-600">
                {message || "Password reset successful. You can now sign in with your new password."}
              </p>
            <Link href={AppRoutes.AUTH.LOGIN}>
              <Button type="button" className="w-full h-12">
                Continue to sign in
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  className={cn(
                    "h-12 w-full pr-11",
                    passwordInvalid && INVALID_INPUT_CLASS
                  )}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  onFocus={() => setShowRules(true)}
                  onBlur={() => setShowRules(newPassword.length > 0)}
                  autoComplete="new-password"
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
                <div className="mt-2 md:absolute md:left-full md:top-0 md:ml-3 md:mt-0 md:w-64 md:z-50">
                  <PasswordRules rules={passwordRulesWithMatch} visible={showRules || newPassword.length > 0 || confirmPassword.length > 0} />
                </div>
              </div>
              {passwordInvalid && (
                <p className="text-sm text-destructive">
                  Password must satisfy all rules ({completedRulesWithMatch}/{passwordRulesWithMatch.length}).
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  className={cn(
                    "h-12 pr-11",
                    passwordMismatch && INVALID_INPUT_CLASS
                  )}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordMismatch && (
                <p className="text-sm text-destructive">Passwords don&apos;t match</p>
              )}
            </div>

            {error && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full h-12" disabled={isPending || !canSubmit}>
              {isPending ? "Updating..." : "Update password"}
            </Button>
          </form>
        )}

        {!isSuccess && (
          <div className="text-center">
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
