'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { AppRoutes } from '@/constants/routes'
import { TaskDialog } from '@/components/tasks/task-dialog'
import { RecentTasksCards } from './cards'
import { RecentTasksTableView } from './table-view'
import type { RecentTask } from '@/types/task'

interface RecentTasksTableProps {
  tasks: RecentTask[]
}

export function RecentTasksTable({ tasks }: RecentTasksTableProps) {
  const [selectedTask, setSelectedTask] = useState<RecentTask | null>(null)

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Tasks</CardTitle>
          <Link
            href={AppRoutes.DASHBOARD.TASKS}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </Link>
        </CardHeader>

        <CardContent className="md:hidden p-0">
          <RecentTasksCards tasks={tasks} onSelect={setSelectedTask} />
        </CardContent>

        <CardContent className="hidden md:block p-0 overflow-x-auto">
          <RecentTasksTableView tasks={tasks} onSelect={setSelectedTask} />
        </CardContent>
      </Card>

      <TaskDialog
        open={!!selectedTask}
        onOpenChange={(open) => { if (!open) setSelectedTask(null) }}
        projectId={selectedTask?.project?.id}
        task={selectedTask ?? undefined}
      />
    </>
  )
}
