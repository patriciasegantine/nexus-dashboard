import { TASK_STATUS_NAMES } from '@/constants/task'

export function BoardStatusHeader() {
  return (
    <div className="grid border-b bg-muted/50 p-4">
      <div className="flex gap-4">
        {Object.entries(TASK_STATUS_NAMES).map(([key, value]) => (
          <span key={key} className="text-sm font-medium">{value}</span>
        ))}
      </div>
    </div>
  )
}
