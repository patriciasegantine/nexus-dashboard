'use client'

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DesktopTaskFilters } from "@/components/tasks/desktop-task-filters"
import { MobileTaskFilters } from "@/components/tasks/mobile-task-filters"
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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
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

  function handleClearMobileFilters() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('status')
    params.delete('priority')
    params.delete('projectId')
    params.delete('dueDate')
    params.delete('page')
    router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname)
  }

  const mobileActiveCount = [currentStatus, currentPriority, currentProject, currentDueDate].filter(Boolean).length
  const secondaryActiveCount = [currentProject, currentDueDate].filter(Boolean).length
  const hasAnyFilter = Boolean(currentSearch || currentStatus || currentPriority || currentProject || currentDueDate)

  return (
    <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
      <div className="flex items-center gap-2 md:contents">
        <div className="relative min-w-0 flex-1 md:min-w-[180px] md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search tasks..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <MobileTaskFilters
          open={mobileFiltersOpen}
          onOpenChange={setMobileFiltersOpen}
          activeCount={mobileActiveCount}
          status={currentStatus}
          priority={currentPriority}
          projectId={currentProject}
          dueDate={currentDueDate}
          projects={projects}
          onFilterChange={updateParam}
          onClear={handleClearMobileFilters}
        />
      </div>

      <DesktopTaskFilters
        status={currentStatus}
        priority={currentPriority}
        projectId={currentProject}
        dueDate={currentDueDate}
        projects={projects}
        secondaryActiveCount={secondaryActiveCount}
        hasAnyFilter={hasAnyFilter}
        onFilterChange={updateParam}
        onClear={handleClearAll}
      />
    </div>
  )
}
