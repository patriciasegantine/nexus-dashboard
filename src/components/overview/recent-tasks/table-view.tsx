import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ClipboardList } from 'lucide-react'
import { columns } from './columns'
import type { RecentTask } from '@/types/task'

interface RecentTasksTableViewProps {
  tasks: RecentTask[]
  onSelect: (task: RecentTask) => void
}

export function RecentTasksTableView({ tasks, onSelect }: RecentTasksTableViewProps) {
  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
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
              onClick={() => onSelect(row.original)}
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
  )
}
