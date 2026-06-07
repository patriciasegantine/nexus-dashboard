"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordRules } from "@/components/password-rules"
import { usePasswordRules } from "@/hooks/use-password-rules"
import { INVALID_INPUT_CLASS } from "@/lib/form-styles"
import { cn } from "@/lib/utils"

type RegisterPasswordFieldsProps = {
  password: string
  confirmPassword: string
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  passwordMismatch: boolean
  passwordInvalid: boolean
}

export function RegisterPasswordFields({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  passwordMismatch,
  passwordInvalid,
}: RegisterPasswordFieldsProps) {
  const { showRules, setShowRules, passwordRules } = usePasswordRules(password)
  const passwordRulesWithMatch = [
    ...passwordRules,
    {
      text: "passwords match",
      valid: confirmPassword.length > 0 && !passwordMismatch,
    },
  ]
  const completedRulesWithMatch = passwordRulesWithMatch.filter((rule) => rule.valid).length
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="enter your password"
            className={cn(
              "h-10 w-full pr-11",
              passwordInvalid && INVALID_INPUT_CLASS
            )}
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            onFocus={() => setShowRules(true)}
            onBlur={() => setShowRules(password.length > 0)}
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
            <PasswordRules rules={passwordRulesWithMatch} visible={showRules || password.length > 0 || confirmPassword.length > 0} />
          </div>
        </div>
        {passwordInvalid && (
          <p className="text-sm text-destructive">
            Password must satisfy all rules ({completedRulesWithMatch}/{passwordRulesWithMatch.length}).
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="confirm your password"
            className={cn(
              "h-10 pr-11",
              passwordMismatch && INVALID_INPUT_CLASS
            )}
            value={confirmPassword}
            onChange={(event) => onConfirmPasswordChange(event.target.value)}
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
    </>
  )
}
