import { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { StatusBadge } from '@/components/tasks/status-badge'
import { PriorityBadge } from '@/components/tasks/priority-badge'
import type { RecentTask } from '@/types/task'

export const columns: ColumnDef<RecentTask>[] = [
  {
    accessorKey: 'title',
    header: 'Task',
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('title')}</span>
    ),
  },
  {
    accessorKey: 'project',
    header: 'Project',
    cell: ({ row }) => {
      const project = row.getValue('project') as RecentTask['project']
      return (
        <span className="text-muted-foreground text-sm">
          {project?.name ?? '—'}
        </span>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <StatusBadge status={row.getValue('status')} />
    ),
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => {
      const priority = row.getValue('priority') as RecentTask['priority']
      if (!priority) return <span className="text-muted-foreground text-sm">—</span>
      return <PriorityBadge priority={priority} />
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {formatDistanceToNow(new Date(row.getValue('updatedAt')), { addSuffix: true })}
      </span>
    ),
  },
]
