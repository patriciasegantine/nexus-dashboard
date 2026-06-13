import { getBoardData } from "@/lib/data/projects"
import { ProjectCard } from "@/components/projects/project-card"
import { NewProjectButton } from "@/components/projects/new-project-button"
import { PageHeader } from "@/components/ui/page-header"
import { FolderKanban } from "lucide-react"

export default async function ProjectsPage() {
  const projects = await getBoardData()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage your projects"
        action={<NewProjectButton iconOnlyOnMobile />}
      />

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No projects yet. Create your first one.</p>
          <NewProjectButton />
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
