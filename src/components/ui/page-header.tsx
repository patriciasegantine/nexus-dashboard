import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  className?: string
}

interface PageHeaderActionProps extends ButtonProps {
  icon: LucideIcon
  iconOnlyOnMobile?: boolean
}

export function PageHeaderAction({
  icon: Icon,
  iconOnlyOnMobile = false,
  children,
  className,
  size = "sm",
  ...props
}: PageHeaderActionProps) {
  return (
    <Button
      size={size}
      className={cn(
        iconOnlyOnMobile && "h-9 w-9 px-0 sm:w-auto sm:px-3",
        className
      )}
      {...props}
    >
      <Icon className="h-4 w-4" />
      <span className={cn(iconOnlyOnMobile && "sr-only sm:not-sr-only")}>
        {children}
      </span>
    </Button>
  )
}

export function PageHeader({
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 pt-6 pb-2",
        className
      )}
    >
      <div className="min-w-0 space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
