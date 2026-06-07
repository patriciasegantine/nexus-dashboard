import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, ListTodo, Timer, AlertCircle, LucideIcon } from 'lucide-react'
import { TASK_STATUS_COLORS } from "@/constants/task"

interface DashboardStatsProps {
  totalTasks: number
  inProgress: number
  completed: number
  overdue: number
}

interface StatCardProps {
  title: string
  value: number
  description: string
  Icon: LucideIcon
  color: string
}

function StatCard({ title, value, description, Icon, color }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground truncate pr-1">{title}</CardTitle>
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

export function DashboardStats({ totalTasks, inProgress, completed, overdue }: DashboardStatsProps) {
  const isEmpty = totalTasks === 0

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <StatCard
        title="Total Tasks"
        value={totalTasks}
        description={isEmpty ? "Start by creating your first project" : "across all projects"}
        Icon={ListTodo}
        color={TASK_STATUS_COLORS.TODO}
      />
      <StatCard
        title="In Progress"
        value={inProgress}
        description="currently active"
        Icon={Timer}
        color={TASK_STATUS_COLORS.IN_PROGRESS}
      />
      <StatCard
        title="Done"
        value={completed}
        description="tasks done"
        Icon={CheckCircle2}
        color={TASK_STATUS_COLORS.DONE}
      />
      <StatCard
        title="Overdue"
        value={overdue}
        description="past due date"
        Icon={AlertCircle}
        color="hsl(var(--destructive))"
      />
    </div>
  )
}
