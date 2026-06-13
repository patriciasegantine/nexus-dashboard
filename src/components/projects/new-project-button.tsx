'use client'

import { useState } from "react"
import { Plus } from "lucide-react"
import { PageHeaderAction } from "@/components/ui/page-header"
import { ProjectDialog } from "./project-dialog"

interface NewProjectButtonProps {
  iconOnlyOnMobile?: boolean
}

export function NewProjectButton({ iconOnlyOnMobile = false }: NewProjectButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <PageHeaderAction
        icon={Plus}
        iconOnlyOnMobile={iconOnlyOnMobile}
        onClick={() => setOpen(true)}
        aria-label="New project"
      >
        New project
      </PageHeaderAction>
      <ProjectDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
