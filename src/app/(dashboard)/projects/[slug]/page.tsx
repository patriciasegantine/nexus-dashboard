import { getProject } from "@/lib/data/projects"
import { notFound } from "next/navigation"
import { ProjectKanban } from "@/components/projects/project-kanban"

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) notFound()

  return <ProjectKanban project={project} />
}
