import { useState } from "react"

export type PasswordRule = {
  text: string
  valid: boolean
}

export const usePasswordRules = (password: string) => {
  const [showRules, setShowRules] = useState(false)
  
  const passwordRules: PasswordRule[] = [
    {
      text: "at least 8 characters",
      valid: password.length >= 8
    },
    {
      text: "one lowercase letter",
      valid: /[a-z]/.test(password)
    },
    {
      text: "one uppercase letter",
      valid: /[A-Z]/.test(password)
    },
    {
      text: "one number",
      valid: /\d/.test(password)
    },
    {
      text: "one special character",
      valid: /[^A-Za-z0-9]/.test(password)
    }
  ]

  const completedRules = passwordRules.filter((rule) => rule.valid).length
  
  return {
    showRules,
    setShowRules,
    passwordRules,
    completedRules
  }
}
