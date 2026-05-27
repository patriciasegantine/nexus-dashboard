"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChartColumn, FolderPlus, Kanban, X } from "lucide-react"
import confetti from "canvas-confetti"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

function getWelcomeSeenKey(userId: string) {
  return `nexus.welcome_seen:${userId}`
}

export function WelcomeModal() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [shouldCelebrate, setShouldCelebrate] = useState(false)
  const userName = session?.user?.name?.trim() || "there"

  useEffect(() => {
    if (status === "unauthenticated") {
      void update()
    }
  }, [status, update])

  useEffect(() => {
    if (status !== "authenticated") return

    const userIdentifier = session?.user?.id ?? session?.user?.email
    if (!userIdentifier) return

    const forceWelcome = searchParams.get("welcome") === "1"
    const key = getWelcomeSeenKey(userIdentifier)
    const seen = localStorage.getItem(key) === "1"

    if (forceWelcome || !seen) {
      setOpen(true)
      setShouldCelebrate(true)
      localStorage.setItem(key, "1")
    }

    if (forceWelcome) {
      router.replace(pathname)
    }
  }, [pathname, router, searchParams, session?.user?.email, session?.user?.id, status])

  useEffect(() => {
    if (!open || !shouldCelebrate) return

    const timer = window.setTimeout(() => {
      void confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.3 },
        colors: ["#7F77DD", "#1D9E75", "#D85A30", "#378ADD"],
      })
      void confetti({
        particleCount: 60,
        spread: 100,
        origin: { y: 0.35 },
        colors: ["#7F77DD", "#1D9E75", "#D85A30", "#378ADD"],
      })
    }, 120)

    return () => {
      window.clearTimeout(timer)
      confetti.reset()
    }
  }, [open, shouldCelebrate])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showClose={false}
        className="max-w-[520px] overflow-hidden rounded-2xl border border-white/10 bg-[#2c2c2c] p-0 text-white shadow-2xl"
      >
        <div className="relative px-8 pb-8 pt-6">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-6 top-5 z-10 rounded-xl border border-white/15 bg-white/5 p-3 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative z-[3] text-center">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center text-[44px]">
              🎉
            </div>
            <DialogTitle asChild>
              <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-normal">
                Great to have you here, {userName}!
              </h2>
            </DialogTitle>
            <p className="mt-2 text-sm text-white/75">
              Your workspace is ready. Here&apos;s how to get started:
            </p>
          </div>

          <ul className="relative z-[3] mt-8 space-y-3 text-left">
            <li className="flex items-center gap-3 rounded-xl bg-black/20 px-4 py-3 text-sm text-white/95">
              <FolderPlus className="h-5 w-5 text-white/85" />
              <span>Create your first project</span>
            </li>
            <li className="flex items-center gap-3 rounded-xl bg-black/20 px-4 py-3 text-sm text-white/95">
              <Kanban className="h-5 w-5 text-white/85" />
              <span>Prioritise tasks on the board</span>
            </li>
            <li className="flex items-center gap-3 rounded-xl bg-black/20 px-4 py-3 text-sm text-white/95">
              <ChartColumn className="h-5 w-5 text-white/85" />
              <span>Track progress in real time</span>
            </li>
          </ul>

          <div className="relative z-[3] mt-8">
            <Button
              variant="outline"
              className="h-12 w-full rounded-xl border-white/20 bg-transparent text-base text-white hover:bg-white/10 hover:text-white"
              onClick={() => setOpen(false)}
            >
              Continue to dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
