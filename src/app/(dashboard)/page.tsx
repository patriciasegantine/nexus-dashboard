import { Rocket } from "lucide-react"
import { getDashboardStats } from '@/lib/data/dashboard'
import { DashboardStats } from '@/components/overview/dashboard-stats'
import { RecentProjects } from '@/components/overview/recent-projects'
import { RecentTasksTable } from '@/components/overview/recent-tasks-table'
import { PriorityDistribution } from '@/components/overview/priority-distribution'
import { TasksByStatus } from '@/components/overview/tasks-by-status'
import { NewProjectButton } from '@/components/projects/new-project-button'
import { SampleDataButton } from '@/components/overview/sample-data-button'

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  const hasNoProjects = (stats?.recentProjects ?? []).length === 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">A summary of your progress and activities</p>
      </div>

      {hasNoProjects && (
        <div className="rounded-lg border bg-card p-8 flex flex-col items-center justify-center text-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
            <Rocket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium">Welcome to Nexus!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first project to start tracking tasks and see your progress here.
            </p>
          </div>
          <div className="flex gap-2">
            <NewProjectButton />
            <SampleDataButton />
          </div>
        </div>
      )}

      <DashboardStats
        totalTasks={stats?.totalTasks ?? 0}
        inProgress={stats?.inProgress ?? 0}
        completed={stats?.completed ?? 0}
        overdue={stats?.overdue ?? 0}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <TasksByStatus byStatus={stats?.byStatus ?? {}} />
        <PriorityDistribution byPriority={stats?.byPriority ?? {}} />
      </div>

      <RecentTasksTable tasks={stats?.recentTasks ?? []} />
      <RecentProjects projects={stats?.recentProjects ?? []} />
    </div>
  )
}
