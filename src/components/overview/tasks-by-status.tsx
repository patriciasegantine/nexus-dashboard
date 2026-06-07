'use client'

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { TASK_STATUS_COLORS, TASK_STATUS_NAMES } from "@/constants/task"
import { BarChart2 } from 'lucide-react'

interface TasksByStatusProps {
  byStatus: Record<string, number>
}

const chartConfig = {
  TODO: { label: TASK_STATUS_NAMES.TODO, color: TASK_STATUS_COLORS.TODO },
  IN_PROGRESS: { label: TASK_STATUS_NAMES.IN_PROGRESS, color: TASK_STATUS_COLORS.IN_PROGRESS },
  DONE: { label: TASK_STATUS_NAMES.DONE, color: TASK_STATUS_COLORS.DONE },
  value: { label: 'Tasks' },
} satisfies ChartConfig

export function TasksByStatus({ byStatus }: TasksByStatusProps) {
  const data = Object.entries(byStatus).map(([status, value]) => ({
    status,
    label: TASK_STATUS_NAMES[status as keyof typeof TASK_STATUS_NAMES] ?? status,
    value,
  }))

  const isEmpty = data.length === 0

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Tasks by Status</CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="h-[140px] flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <BarChart2 className="h-8 w-8" />
            <p className="text-sm">No data yet</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] sm:h-[300px] w-full">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent nameKey="status" indicator="dot" />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={TASK_STATUS_COLORS[entry.status as keyof typeof TASK_STATUS_COLORS]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
