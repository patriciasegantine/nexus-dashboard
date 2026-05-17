import { redirect } from "next/navigation"
// Password reset is handled via Google OAuth
export default function ForgotPasswordPage() {
  redirect("/login")
}
