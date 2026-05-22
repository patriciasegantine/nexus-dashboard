"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordRules } from "@/components/password-rules"
import { usePasswordRules } from "@/hooks/use-password-rules"

type RegisterPasswordFieldsProps = {
  password: string
  confirmPassword: string
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  passwordMismatch: boolean
}

export function RegisterPasswordFields({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  passwordMismatch,
}: RegisterPasswordFieldsProps) {
  const { showRules, setShowRules, passwordRules } = usePasswordRules(password)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 characters"
            className="h-12 pr-11"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            onFocus={() => setShowRules(true)}
            onBlur={() => setShowRules(password.length > 0)}
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
        <PasswordRules rules={passwordRules} visible={showRules || password.length > 0} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Repeat your password"
            className="h-12 pr-11"
            value={confirmPassword}
            onChange={(event) => onConfirmPasswordChange(event.target.value)}
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
