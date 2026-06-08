'use client'

import { useTheme } from 'next-themes'
import { TASK_STATUS_COLORS, TASK_STATUS_NAMES } from '@/constants/task'
import type { TaskStatus } from '@/types/task'

interface StatusBadgeProps {
  status: TaskStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { resolvedTheme } = useTheme()
  const opacity = resolvedTheme === 'dark' ? '66' : '33'

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: TASK_STATUS_COLORS[status] + opacity }}
    >
      {TASK_STATUS_NAMES[status]}
    </span>
  )
}
