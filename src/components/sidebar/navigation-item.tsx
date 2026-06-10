'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'
import type { NavItem } from './config'

interface NavigationItemProps {
  item: NavItem
  isActive: boolean
  isCollapsed: boolean
  onItemSelect?: () => void
}

export function NavigationItem({ item, isActive, isCollapsed, onItemSelect }: NavigationItemProps) {
  const Icon = item.icon

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            variant={isActive ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start overflow-hidden transition-all duration-200',
              'hover:translate-x-0.5 hover:bg-muted/80',
              isActive && 'bg-muted',
              isCollapsed && 'justify-center px-2 gap-0'
            )}
          >
            <Link href={item.href} onClick={onItemSelect}>
              <Icon className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />
              <span
                className={cn(
                  'truncate whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  isCollapsed
                    ? 'max-w-0 opacity-0 translate-x-1'
                    : 'max-w-[140px] opacity-100 translate-x-0'
                )}
              >
                {item.title}
              </span>
            </Link>
          </Button>
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
