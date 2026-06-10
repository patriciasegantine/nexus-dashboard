import { NavigationItem } from './navigation-item'
import { MAIN_NAV_ITEMS, BOTTOM_NAV_ITEMS } from './config'

interface NavigationSectionProps {
  pathname: string
  isCollapsed: boolean
  onItemSelect?: () => void
}

export function NavigationSection({ pathname, isCollapsed, onItemSelect }: NavigationSectionProps) {
  return (
    <div className="flex flex-col flex-1 py-4 overflow-hidden">
      <div className="flex-1 px-3">
        <nav className="space-y-1">
          {MAIN_NAV_ITEMS.map((item) => (
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

      <div className="px-3 pb-2">
        <div className="h-px bg-border mb-3" />
        <nav className="space-y-1">
          {BOTTOM_NAV_ITEMS.map((item) => (
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
