'use client'

import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useApp } from '@/contexts/app-context'
import { SIDEBAR_CONFIG } from './config'
import { NavigationSection } from './navigation-section'
import { CollapseToggle } from './collapse-toggle'

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, isMobileSidebarOpen, toggleSidebar, closeMobileSidebar } = useApp()

  const sidebarWidth = isCollapsed ? SIDEBAR_CONFIG.COLLAPSED_WIDTH : SIDEBAR_CONFIG.EXPANDED_WIDTH

  return (
    <>
      {/* Mobile overlay */}
      <button
        type="button"
        className={cn(
          'fixed inset-0 top-16 z-30 bg-black/40 backdrop-blur-[1px] md:hidden',
          'transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeMobileSidebar}
        aria-label="Close sidebar"
      />

      {/* Mobile sidebar */}
      <div
        className={cn(
          `fixed ${SIDEBAR_CONFIG.TOP_OFFSET} left-0 ${SIDEBAR_CONFIG.HEIGHT} border-r bg-background z-40`,
          'w-64 md:hidden overflow-hidden will-change-transform',
          'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <NavigationSection pathname={pathname} isCollapsed={false} onItemSelect={closeMobileSidebar} />
      </div>

      {/* Desktop sidebar */}
      <div
        suppressHydrationWarning
        className={cn(
          `fixed ${SIDEBAR_CONFIG.TOP_OFFSET} left-0 ${SIDEBAR_CONFIG.HEIGHT} border-r bg-background`,
          'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:flex flex-col hidden overflow-hidden',
          sidebarWidth
        )}
      >
        <NavigationSection pathname={pathname} isCollapsed={isCollapsed} />
        <CollapseToggle isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      </div>
    </>
  )
}
