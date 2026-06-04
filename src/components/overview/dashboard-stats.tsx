'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Clock, ListTodo, Loader2 } from 'lucide-react'
import React from "react";
import { useDashboardStats } from "@/hooks/dashboard/use-dashboard-stats";
import { TASK_STATUS_COLORS } from "@/constants/task";

interface StatsCardProps {
  title: string
  value: number | string | undefined
  icon?: React.ReactNode
  isLoading: boolean
}

export function DashboardStats() {
  const {data: stats, isLoading} = useDashboardStats()
  
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatsCard
        title="Total Tasks"
        value={stats?.totalTasks}
        icon={<ListTodo className="h-4 w-4 text-muted-foreground"/>}
        isLoading={isLoading}
      />
      <StatsCard
        title="Todo"
        value={stats?.byStatus['TODO']}
        icon={<Clock className="h-4 w-4" style={{color: TASK_STATUS_COLORS.TODO}}/>}
        isLoading={isLoading}
      />
      <StatsCard
        title="In Progress"
        value={stats?.inProgress}
        icon={<Clock className="h-4 w-4" style={{color: TASK_STATUS_COLORS.IN_PROGRESS}}/>}
        isLoading={isLoading}
      />
      <StatsCard
        title="Completed"
        value={stats?.completed}
        icon={<CheckCircle2 className="h-4 w-4" style={{color: TASK_STATUS_COLORS.DONE}}/>}
        isLoading={isLoading}
      />
    </div>
  )
}

function StatsCard({title, value, icon, isLoading}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin"/>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  )
}
