"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { clearAllData } from "@/actions/settings"

const CONFIRM_KEYWORD = "DELETE"

export function DangerZone() {
  const [open, setOpen] = useState(false)
  const [confirmInput, setConfirmInput] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  function handleOpenChange(value: boolean) {
    if (!loading) {
      setOpen(value)
      if (!value) setConfirmInput("")
    }
  }

  async function handleClear() {
    setLoading(true)
    const result = await clearAllData()
    setLoading(false)

    if (result.success) {
      setOpen(false)
      toast({ description: "All data cleared successfully." })
      router.push("/")
    } else {
      toast({ variant: "destructive", description: result.error })
    }
  }

  return (
    <div className="rounded-lg border border-destructive/40 p-6 space-y-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-destructive">Danger Zone</h2>
        <p className="text-sm text-muted-foreground">
          Permanently delete all your projects and tasks. This action cannot be undone.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
        <div>
          <p className="text-sm font-medium">Clear all data</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Remove all projects and tasks from your workspace.
          </p>
        </div>

        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="outline" className="shrink-0 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
              Clear all data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clear all data?</DialogTitle>
              <DialogDescription>
                This will permanently delete all your projects and tasks. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 py-2">
              <Label htmlFor="confirm-input">
                Type <span className="font-mono font-semibold text-foreground">{CONFIRM_KEYWORD}</span> to confirm
              </Label>
              <Input
                id="confirm-input"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder={CONFIRM_KEYWORD}
                disabled={loading}
                autoComplete="off"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={confirmInput !== CONFIRM_KEYWORD || loading}
                onClick={handleClear}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Clear all data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
