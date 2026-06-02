export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Welcome back!",
  REGISTER_SUCCESS: "Account created successfully! Please check your email.",
  FORGOT_PASSWORD: "If an account exists with this email, you will receive password reset instructions.",
  LOGOUT_SUCCESS: "You have been signed out.",
  RESET_PASSWORD_SUCCESS: "Password reset successful. You can now login with your new password.",
  RESET_PASSWORD_FAIL: "Failed to reset password. Please try again.",
  INVALID_CREDENTIALS: "Invalid email or password",
  INVALID_EMAIL: "Please enter a valid email address.",
  USER_ALREADY_EXISTS: "This email is already registered",
  INVALID_RESET_LINK: "This password reset link is invalid or has expired",
  SAME_PASSWORD: "New password must be different from your current password",
} as const
