import { Skeleton } from '@/components/ui/skeleton'

function TaskCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 flex flex-col gap-3 h-36">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24 mt-1" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
}

export default function TasksLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-28" />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
    </div>
  )
}
