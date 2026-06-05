'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ProjectDialog } from "./project-dialog"

export function NewProjectButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        New project
      </Button>
      <ProjectDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
