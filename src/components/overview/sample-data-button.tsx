"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { populateSampleData } from "@/actions/demo"

export function SampleDataButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleConfirm() {
    setLoading(true)
    const result = await populateSampleData()
    setLoading(false)
    setOpen(false)
    if (result.success) {
      toast({ description: "Sample data added! Feel free to explore." })
    } else {
      toast({ variant: "destructive", description: result.error })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Try with sample data</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Populate with sample data?</AlertDialogTitle>
          <AlertDialogDescription>
            This will add 3 sample projects and 15 tasks to your workspace so you can explore all features.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault()
              handleConfirm()
            }}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Let&apos;s go!
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
