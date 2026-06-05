'use client'

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import Link from "next/link"
import { AppRoutes } from "@/constants/routes"
import { ProjectDialog } from "./project-dialog"
import { DeleteProjectButton } from "./delete-project-button"
import { ProjectBoardItem } from "@/types/project"
import { ACCENT_COLORS, TAG_COLORS, colorIndex, progressColor } from "./project-card.utils"

export interface ProjectCardProps {
  project: ProjectBoardItem
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [editOpen, setEditOpen] = useState(false)

  const accent = ACCENT_COLORS[colorIndex(project.id, ACCENT_COLORS.length)]
  const barColor = progressColor(project.progress, project.total)

  return (
    <>
      <Card className={`hover:bg-muted/50 transition-colors border-l-4 border-b-1 ${accent.border}`}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className={`${accent.avatar} rounded-md h-8 w-8 flex items-center justify-center shrink-0 mt-0.5`}>
                  <span className="text-white text-sm font-semibold">
                    {project.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <Link
                    href={`${AppRoutes.DASHBOARD.PROJECTS}/${project.id}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {project.name}
                  </Link>
                  {project.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{project.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => setEditOpen(true)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <DeleteProjectButton projectId={project.id} projectName={project.name} />
              </div>
            </div>

            <div className="space-y-5">
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${barColor}`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{project.total} tasks</span>
                <span>{project.todo} todo</span>
                <span>{project.inProgress} in progress</span>
                <span>{project.done} done</span>
                <span className="ml-auto font-medium text-foreground">{project.progress}%</span>
              </div>
            </div>

            {project.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {project.tags.map((tag, i) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${TAG_COLORS[i % TAG_COLORS.length]}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ProjectDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        project={project}
      />
    </>
  )
}
