import { TASK_PRIORITY_NAMES, TASK_STATUS_NAMES } from "@/constants/task"
import type { Project } from "@/types/project"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FilterFieldProps {
  value: string
  onChange: (value: string | null) => void
  className?: string
}

interface ProjectFilterFieldProps extends FilterFieldProps {
  projects: Project[]
}

export function StatusFilterField({ value, onChange, className }: FilterFieldProps) {
  return (
    <Select
      value={value || "all"}
      onValueChange={(nextValue) => onChange(nextValue === "all" ? null : nextValue)}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All statuses</SelectItem>
        {Object.entries(TASK_STATUS_NAMES).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function PriorityFilterField({ value, onChange, className }: FilterFieldProps) {
  return (
    <Select
      value={value || "all"}
      onValueChange={(nextValue) => onChange(nextValue === "all" ? null : nextValue)}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All priorities</SelectItem>
        {Object.entries(TASK_PRIORITY_NAMES).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function ProjectFilterField({
  value,
  onChange,
  projects,
  className,
}: ProjectFilterFieldProps) {
  return (
    <Select
      value={value || "all"}
      onValueChange={(nextValue) => onChange(nextValue === "all" ? null : nextValue)}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="All projects" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All projects</SelectItem>
        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            {project.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function DueDateFilterField({ value, onChange, className }: FilterFieldProps) {
  return (
    <Select
      value={value || "all"}
      onValueChange={(nextValue) => onChange(nextValue === "all" ? null : nextValue)}
    >
      <SelectTrigger className={className}>
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
  )
}
