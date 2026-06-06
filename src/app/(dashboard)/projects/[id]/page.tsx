import { getProject } from "@/lib/data/projects"
import { notFound } from "next/navigation"
import { ProjectKanban } from "@/components/projects/project-kanban"

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params
  const project = await getProject(id)

  if (!project) notFound()

  return <ProjectKanban project={project} />
}
