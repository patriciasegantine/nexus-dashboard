'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { AppRoutes } from '@/constants/routes'
import { ChevronLeft, KanbanSquare, LayoutDashboard, ListTodo, Settings, User } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useApp } from "@/contexts/app-context"

const SIDEBAR_CONFIG = {
  COLLAPSED_WIDTH: 'w-[70px]',
  EXPANDED_WIDTH: 'w-64',
  TOP_OFFSET: 'top-[64px]',
  HEIGHT: 'h-[calc(100vh-64px)]'
} as const

const SIDEBAR_ITEMS = [
  {
    title: "Overview",
    href: AppRoutes.DASHBOARD.HOME,
    icon: LayoutDashboard
  },
  {
    title: "Board",
    href: AppRoutes.DASHBOARD.BOARD,
    icon: KanbanSquare
  },
  {
    title: "Work Items",
    href: AppRoutes.DASHBOARD.WORK_ITEMS,
    icon: ListTodo
  },
  {
    title: "Profile",
    href: AppRoutes.DASHBOARD.PROFILE,
    icon: User
  },
  {
    title: "Settings",
    href: AppRoutes.DASHBOARD.SETTINGS,
    icon: Settings
  }
] as const

export function Sidebar() {
  const pathname = usePathname()
  const {isCollapsed, isMobileSidebarOpen, toggleSidebar, closeMobileSidebar} = useApp()
  
  const sidebarWidth = isCollapsed ? SIDEBAR_CONFIG.COLLAPSED_WIDTH : SIDEBAR_CONFIG.EXPANDED_WIDTH
  
  return (
    <>
      {isMobileSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 top-16 z-30 bg-black/50 md:hidden"
          onClick={closeMobileSidebar}
          aria-label="Close sidebar"
        />
      )}

      <div className={cn(
        `fixed ${SIDEBAR_CONFIG.TOP_OFFSET} left-0 ${SIDEBAR_CONFIG.HEIGHT} border-r bg-background z-40`,
        "transition-transform duration-300 ease-in-out w-64 md:hidden",
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <NavigationSection
          pathname={pathname}
          isCollapsed={false}
          onItemSelect={closeMobileSidebar}
        />
      </div>

      <div className={cn(
        `fixed ${SIDEBAR_CONFIG.TOP_OFFSET} left-0 ${SIDEBAR_CONFIG.HEIGHT} border-r bg-background`,
        "transition-all duration-300 ease-in-out md:flex flex-col hidden",
        sidebarWidth
      )}>
        <NavigationSection
          pathname={pathname}
          isCollapsed={isCollapsed}
        />
        <CollapseToggleSection
          isCollapsed={isCollapsed}
          onToggle={toggleSidebar}
        />
      </div>
    </>
  )
}

interface NavigationSectionProps {
  pathname: string
  isCollapsed: boolean
  onItemSelect?: () => void
}

function NavigationSection({pathname, isCollapsed, onItemSelect}: NavigationSectionProps) {
  return (
    <div className="flex-1 space-y-4 py-4">
      <div className="px-3 py-2">
        <nav className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <NavigationItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
              onItemSelect={onItemSelect}
            />
          ))}
        </nav>
      </div>
    </div>
  )
}

interface NavigationItemProps {
  item: typeof SIDEBAR_ITEMS[number]
  isActive: boolean
  isCollapsed: boolean
  onItemSelect?: () => void
}

function NavigationItem({item, isActive, isCollapsed, onItemSelect}: NavigationItemProps) {
  const IconComponent = item.icon
  
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={item.href} onClick={onItemSelect}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "bg-muted",
                isCollapsed && "justify-center px-2"
              )}
            >
              <IconComponent className={cn("h-4 w-4", !isCollapsed && "mr-2")}/>
              {!isCollapsed && <span>{item.title}</span>}
            </Button>
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" className="pointer-events-none">
            {item.title}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

interface CollapseToggleSectionProps {
  isCollapsed: boolean
  onToggle: () => void
}

function CollapseToggleSection({isCollapsed, onToggle}: CollapseToggleSectionProps) {
  const tooltipText = isCollapsed ? "Expand sidebar" : "Collapse sidebar"
  
  return (
    <div className="p-1 border-t">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full flex items-center justify-center transition-all duration-300 ease-in-out"
              onClick={onToggle}
            >
              <ChevronLeft
                className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")}
              />
              {!isCollapsed && <span className="ml-2">{tooltipText}</span>}
            </Button>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right" className="pointer-events-none">
              {tooltipText}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
