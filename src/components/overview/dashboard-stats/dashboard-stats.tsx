import { CheckCircle2, ListTodo, Timer, AlertCircle } from 'lucide-react'
import { TASK_STATUS_COLORS } from '@/constants/task'
import { StatCard } from './stat-card'

interface DashboardStatsProps {
  totalTasks: number
  inProgress: number
  completed: number
  overdue: number
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
