'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ChevronLeft } from 'lucide-react'

interface CollapseToggleProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function CollapseToggle({ isCollapsed, onToggle }: CollapseToggleProps) {
  const label = isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'

  return (
    <div className="p-1 border-t">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full flex items-center justify-center transition-all duration-300 ease-out hover:bg-muted/70"
              onClick={onToggle}
            >
              <ChevronLeft
                className={cn('h-4 w-4 transition-transform', isCollapsed && 'rotate-180')}
              />
              <span
                className={cn(
                  'ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[160px] opacity-100'
                )}
              >
                {label}
              </span>
            </Button>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right" className="pointer-events-none">
              {label}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
