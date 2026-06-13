import type { ReactNode } from "react"
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

interface MobileTaskFiltersProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeCount: number
  status: string
  priority: string
  projectId: string
  dueDate: string
  projects: Project[]
  onFilterChange: (key: string, value: string | null) => void
  onClear: () => void
}

export function MobileTaskFilters({
  open,
  onOpenChange,
  activeCount,
  status,
  priority,
  projectId,
  dueDate,
  projects,
  onFilterChange,
  onClear,
}: MobileTaskFiltersProps) {
  function handleClear() {
    onClear()
    onOpenChange(false)
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-10 w-10 shrink-0 md:hidden"
          aria-label="More filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -right-1.5 -top-1.5 h-5 min-w-5 px-1 text-[10px]"
            >
              {activeCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[calc(100vw-2rem)] space-y-4 p-4"
        align="end"
      >
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <p className="font-medium">Filters</p>
            <p className="text-xs text-muted-foreground">Refine the tasks shown</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onOpenChange(false)}
            aria-label="Close filters"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <FilterField label="Status">
          <StatusFilterField
            value={status}
            onChange={(value) => onFilterChange("status", value)}
            className="w-full"
          />
        </FilterField>

        <FilterField label="Priority">
          <PriorityFilterField
            value={priority}
            onChange={(value) => onFilterChange("priority", value)}
            className="w-full"
          />
        </FilterField>

        <FilterField label="Project">
          <ProjectFilterField
            value={projectId}
            onChange={(value) => onFilterChange("projectId", value)}
            projects={projects}
            className="w-full"
          />
        </FilterField>

        <FilterField label="Due date">
          <DueDateFilterField
            value={dueDate}
            onChange={(value) => onFilterChange("dueDate", value)}
            className="w-full"
          />
        </FilterField>

        <div className="flex gap-2 border-t pt-4">
          {activeCount > 0 && (
            <Button variant="outline" className="flex-1" onClick={handleClear}>
              Clear filters
            </Button>
          )}
          <Button className="flex-1" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function FilterField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">{label}</p>
      {children}
    </div>
  )
}
