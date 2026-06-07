import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { FolderKanban } from 'lucide-react'
import Link from 'next/link'
import { AppRoutes } from '@/constants/routes'
import type { RecentProject } from '@/types/project'

interface RecentProjectsProps {
  projects: RecentProject[]
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Projects</CardTitle>
        <Link href={AppRoutes.DASHBOARD.PROJECTS} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          View all
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
            <FolderKanban className="h-8 w-8" />
            <p className="text-sm">No projects yet.</p>
          </div>
        ) : (
          <div>
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`${AppRoutes.DASHBOARD.PROJECTS}/${project.slug}`}
                className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-muted transition-colors cursor-pointer group"
              >
                <div className="rounded-md h-8 w-8 flex items-center justify-center shrink-0" style={{ backgroundColor: project.color }}>
                  <span className="text-white text-sm font-semibold">
                    {project.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{project.name}</p>
                  {project.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1 truncate">{project.description}</p>
                  )}
                </div>

                <div className="shrink-0 text-right space-y-0.5">
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {project._count.tasks} {project._count.tasks === 1 ? 'task' : 'tasks'}
                  </p>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
