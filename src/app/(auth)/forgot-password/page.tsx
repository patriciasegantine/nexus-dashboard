"use client"

import { useState } from "react"
import Link from "next/link"
import { AppRoutes } from "@/constants/routes"
import { ApiRoutes } from "@/constants/api-routes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSuccess(false)
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
    <div className="min-h-[calc(100dvh-64px)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8 md:-translate-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-light">Forgot your password?</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we&apos;ll send reset instructions.
          </p>
        </div>

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
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="h-12"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            {error && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full h-12" disabled={isPending}>
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
      </div>
    </div>
  )
}
