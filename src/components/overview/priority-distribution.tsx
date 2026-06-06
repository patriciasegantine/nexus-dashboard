'use client'

import { Cell, Pie, PieChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { TASK_PRIORITIES_COLORS, TASK_PRIORITY_NAMES } from "@/constants/task"
import { PieChart as PieChartIcon } from 'lucide-react'

interface PriorityDistributionProps {
  byPriority?: Record<string, number>
}

const chartConfig = {
  LOW: { label: TASK_PRIORITY_NAMES.LOW, color: TASK_PRIORITIES_COLORS.LOW },
  MEDIUM: { label: TASK_PRIORITY_NAMES.MEDIUM, color: TASK_PRIORITIES_COLORS.MEDIUM },
  HIGH: { label: TASK_PRIORITY_NAMES.HIGH, color: TASK_PRIORITIES_COLORS.HIGH },
  value: { label: 'Tasks' },
} satisfies ChartConfig

export function PriorityDistribution({ byPriority = {} }: PriorityDistributionProps) {
  const data = Object.entries(byPriority).map(([priority, value]) => ({
    priority,
    label: TASK_PRIORITY_NAMES[priority as keyof typeof TASK_PRIORITY_NAMES] ?? priority,
    value,
  }))

  const isEmpty = data.length === 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Priority Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="h-[140px] flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <PieChartIcon className="h-8 w-8" />
            <p className="text-sm">No data yet</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="priority" indicator="dot" />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="priority"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.priority}
                    fill={TASK_PRIORITIES_COLORS[entry.priority as keyof typeof TASK_PRIORITIES_COLORS]}
                  />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="priority" />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
