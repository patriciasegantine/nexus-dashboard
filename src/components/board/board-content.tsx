import { Task } from '@/types/task'

interface BoardContentProps {
  tasks?: Task[]
}

export function BoardContent({ tasks }: BoardContentProps) {
  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-1">
        {tasks?.map(task => (
          <div key={task.id} className="border-b p-4">
            {task.title}
          </div>
        ))}
      </div>
    </div>
  )
}
