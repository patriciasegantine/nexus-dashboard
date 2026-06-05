'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Pencil } from "lucide-react"
import Link from "next/link"
import { AppRoutes } from "@/constants/routes"
import { ProjectDialog } from "./project-dialog"
import { DeleteProjectButton } from "./delete-project-button"

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description?: string | null
    total: number
    done: number
    progress: number
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <Card className="hover:bg-muted/50 transition-colors h-full">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`${AppRoutes.DASHBOARD.PROJECTS}/${project.id}`}
              className="flex-1 min-w-0"
            >
              <CardTitle className="text-base hover:underline">{project.name}</CardTitle>
              {project.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {project.description}
                </p>
              )}
            </Link>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <DeleteProjectButton projectId={project.id} projectName={project.name} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={project.progress} className="h-1.5" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{project.progress}% complete</span>
            <Badge variant="secondary">{project.total} tasks</Badge>
          </div>
        </CardContent>
      </Card>

      <ProjectDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        project={{ id: project.id, name: project.name, description: project.description }}
      />
    </>
  )
}
