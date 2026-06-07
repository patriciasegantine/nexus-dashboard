'use client'

import { useState } from 'react'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { AppRoutes } from '@/constants/routes'
import { TaskDialog } from '@/components/tasks/task-dialog'
import { ClipboardList } from 'lucide-react'
import { columns } from './recent-tasks-table.columns'
import type { RecentTask } from '@/types/task'

interface RecentTasksTableProps {
  tasks: RecentTask[]
}

export function RecentTasksTable({ tasks }: RecentTasksTableProps) {
  const [selectedTask, setSelectedTask] = useState<RecentTask | null>(null)

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

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
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-[600px]">
            {table.getRowModel().rows.length > 0 && (
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-muted hover:bg-muted">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
            )}
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedTask(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
                      <ClipboardList className="h-8 w-8" />
                      <p className="text-sm">No tasks yet.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
