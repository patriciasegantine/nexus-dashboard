"use client"

import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChartColumn, FolderPlus, Kanban, X } from "lucide-react"
import confetti from "canvas-confetti"
import {
  Dialog,
  DialogContent,
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
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
      localStorage.setItem(key, "1")
    }

    if (forceWelcome) {
      router.replace(pathname)
    }
  }, [pathname, router, searchParams, session?.user?.email, session?.user?.id, status])

  useEffect(() => {
    if (!open || !canvasRef.current) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const canvasEl = canvasRef.current
    const fire = confetti.create(canvasEl, { resize: true, useWorker: true })
    const timer = window.setTimeout(() => {
      fire({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.3 },
        colors: ["#7F77DD", "#1D9E75", "#D85A30", "#378ADD"],
      })
    }, 400)

    return () => {
      window.clearTimeout(timer)
      fire.reset()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl overflow-hidden p-0">
        <div className="relative px-6 pb-6 pt-5">
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative z-[1] text-center">
            <div className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-xl">
              🎉
            </div>
            <h2 className="mt-4 text-2xl font-semibold leading-tight">
              Great to have you here, {userName}!
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your workspace is ready. Here&apos;s how to get started:
            </p>
          </div>

          <ul className="relative z-[1] mt-6 space-y-3 text-left text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <FolderPlus className="h-4 w-4 text-primary" />
              <span>Create your first project</span>
            </li>
            <li className="flex items-center gap-3">
              <Kanban className="h-4 w-4 text-primary" />
              <span>Prioritise tasks on the board</span>
            </li>
            <li className="flex items-center gap-3">
              <ChartColumn className="h-4 w-4 text-primary" />
              <span>Track progress in real time</span>
            </li>
          </ul>

          <div className="relative z-[1] mt-6">
            <Button className="w-full" onClick={() => setOpen(false)}>
              Continue to dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
