'use client'

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TASK_STATUS_NAMES, TASK_PRIORITY_NAMES } from "@/constants/task"
import type { Project } from "@/types/project"

interface TaskFiltersProps {
  projects: Project[]
}

export function TaskFilters({ projects }: TaskFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get('search') ?? ''
  const currentStatus = searchParams.get('status') ?? ''
  const currentPriority = searchParams.get('priority') ?? ''
  const currentProject = searchParams.get('projectId') ?? ''
  const currentDueDate = searchParams.get('dueDate') ?? ''

  const [searchValue, setSearchValue] = useState(currentSearch)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setSearchValue(currentSearch)
  }, [currentSearch])

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.replace(`${pathname}?${params.toString()}`)
  }

  function handleSearchChange(value: string) {
    setSearchValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateParam('search', value || null)
    }, 300)
  }

  function handleClearAll() {
    router.replace(pathname)
    setSearchValue('')
  }

  const secondaryActiveCount = [currentProject, currentDueDate].filter(Boolean).length
  const hasAnyFilter = Boolean(currentSearch || currentStatus || currentPriority || currentProject || currentDueDate)

  return (
    <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">

      {/* Search — full width on mobile */}
      <div className="relative w-full md:flex-1 md:min-w-[180px] md:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search tasks..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Second row on mobile: status + priority + filters + clear */}
      <div className="flex items-center gap-2">
        <Select
          value={currentStatus || 'all'}
          onValueChange={(v) => updateParam('status', v === 'all' ? null : v)}
        >
          <SelectTrigger className="flex-1 md:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(Object.entries(TASK_STATUS_NAMES) as [keyof typeof TASK_STATUS_NAMES, string][]).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentPriority || 'all'}
          onValueChange={(v) => updateParam('priority', v === 'all' ? null : v)}
        >
          <SelectTrigger className="flex-1 md:w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            {(Object.entries(TASK_PRIORITY_NAMES) as [keyof typeof TASK_PRIORITY_NAMES, string][]).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 gap-2 shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden md:inline">Filters</span>
              {secondaryActiveCount > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {secondaryActiveCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 space-y-4" align="end">
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Project</p>
              <Select
                value={currentProject || 'all'}
                onValueChange={(v) => updateParam('projectId', v === 'all' ? null : v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All projects</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <p className="text-sm font-medium">Due date</p>
              <Select
                value={currentDueDate || 'all'}
                onValueChange={(v) => updateParam('dueDate', v === 'all' ? null : v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All dates</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="today">Due today</SelectItem>
                  <SelectItem value="this_week">Due this week</SelectItem>
                  <SelectItem value="no_due_date">No due date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>

        {hasAnyFilter && (
          <Button variant="ghost" size="sm" className="h-10 gap-1.5 text-muted-foreground shrink-0" onClick={handleClearAll}>
            <X className="h-4 w-4" />
            <span className="hidden md:inline">Clear filters</span>
          </Button>
        )}
      </div>

    </div>
  )
}
