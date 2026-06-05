import { getBoardData } from "@/lib/data/projects"
import { ProjectCard } from "@/components/projects/project-card"
import { NewProjectButton } from "@/components/projects/new-project-button"
import { FolderKanban } from "lucide-react"

export default async function ProjectsPage() {
  const projects = await getBoardData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your projects</p>
        </div>
        <NewProjectButton />
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No projects yet. Create your first one.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
