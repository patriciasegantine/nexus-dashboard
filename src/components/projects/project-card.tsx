'use client'

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import Link from "next/link"
import { AppRoutes } from "@/constants/routes"
import { ProjectDialog } from "./project-dialog"
import { DeleteProjectButton } from "./delete-project-button"

const ACCENT_COLORS = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-yellow-500",
  "bg-rose-500",
]

const TAG_COLORS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
]

const MOCK_TAGS = ["frontend", "backend", "design"]

function colorIndex(id: string, length: number) {
  return id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % length
}

function progressColor(progress: number, total: number) {
  if (total === 0 || progress === 0) return "bg-red-500"
  if (progress < 30) return "bg-red-500"
  if (progress < 70) return "bg-amber-500"
  return "bg-emerald-500"
}

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description?: string | null
    total: number
    todo: number
    inProgress: number
    done: number
    progress: number
    overdue: number
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [editOpen, setEditOpen] = useState(false)

  const avatarColor = ACCENT_COLORS[colorIndex(project.id, ACCENT_COLORS.length)]
  const barColor = progressColor(project.progress, project.total)

  return (
    <>
      <Card className="hover:bg-muted/50 transition-colors">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className={`${avatarColor} rounded-md h-8 w-8 flex items-center justify-center shrink-0 mt-0.5`}>
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

            <div className="space-y-1.5">
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

            <div className="flex items-center gap-1.5 flex-wrap">
              {MOCK_TAGS.map((tag, i) => (
                <span
                  key={tag}
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${TAG_COLORS[i % TAG_COLORS.length]}`}
                >
                  {tag}
                </span>
              ))}
            </div>
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
