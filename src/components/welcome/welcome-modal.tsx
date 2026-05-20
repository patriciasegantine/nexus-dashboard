"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function getWelcomeSeenKey(userId: string) {
  return `nexus.welcome_seen:${userId}`
}

export function WelcomeModal() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return

    const forceWelcome = searchParams.get("welcome") === "1"
    const key = getWelcomeSeenKey(session.user.id)
    const seen = localStorage.getItem(key) === "1"

    if (forceWelcome || !seen) {
      setOpen(true)
      localStorage.setItem(key, "1")
    }

    if (forceWelcome) {
      router.replace(pathname)
    }
  }, [pathname, router, searchParams, session?.user?.id, status])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl p-0 overflow-hidden">
        <div className="px-6 py-5">
          <div className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Welcome to Nexus
          </div>
          <DialogHeader className="mt-4 space-y-2 text-left">
            <DialogTitle className="text-2xl font-semibold leading-tight">
              Great to have you here
            </DialogTitle>
            <DialogDescription className="text-sm leading-6">
              Your workspace is ready. Plan work, track delivery, and keep your team aligned from one place.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6">
          <div className="grid gap-3 text-sm text-muted-foreground">
            <p>Start by creating your first project and inviting teammates.</p>
            <p>Use the board to prioritise tasks and monitor progress in real time.</p>
          </div>

          <DialogFooter className="mt-6 px-0 pb-0">
            <Button className="w-full sm:w-auto" onClick={() => setOpen(false)}>
              Continue to dashboard
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
