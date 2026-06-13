import { SlidersHorizontal, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DueDateFilterField,
  PriorityFilterField,
  ProjectFilterField,
  StatusFilterField,
} from "@/components/tasks/task-filter-fields"
import type { Project } from "@/types/project"

interface DesktopTaskFiltersProps {
  status: string
  priority: string
  projectId: string
  dueDate: string
  projects: Project[]
  secondaryActiveCount: number
  hasAnyFilter: boolean
  onFilterChange: (key: string, value: string | null) => void
  onClear: () => void
}

export function DesktopTaskFilters({
  status,
  priority,
  projectId,
  dueDate,
  projects,
  secondaryActiveCount,
  hasAnyFilter,
  onFilterChange,
  onClear,
}: DesktopTaskFiltersProps) {
  return (
    <div className="hidden items-center gap-2 md:flex">
      <StatusFilterField
        value={status}
        onChange={(value) => onFilterChange("status", value)}
        className="w-[140px]"
      />
      <PriorityFilterField
        value={priority}
        onChange={(value) => onFilterChange("priority", value)}
        className="w-[140px]"
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-10 shrink-0 gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {secondaryActiveCount > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {secondaryActiveCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 space-y-4 p-4" align="end">
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Project</p>
            <ProjectFilterField
              value={projectId}
              onChange={(value) => onFilterChange("projectId", value)}
              projects={projects}
              className="w-full"
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Due date</p>
            <DueDateFilterField
              value={dueDate}
              onChange={(value) => onFilterChange("dueDate", value)}
              className="w-full"
            />
          </div>
        </PopoverContent>
      </Popover>

      {hasAnyFilter && (
        <Button
          variant="ghost"
          size="sm"
          className="h-10 shrink-0 gap-1.5 text-muted-foreground"
          onClick={onClear}
        >
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  )
}
