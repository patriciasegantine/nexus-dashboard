'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const THEMES = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const

export function ThemeSettings() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Theme</h2>
        <p className="text-sm text-muted-foreground">Choose how Nexus looks for you.</p>
      </div>

      <div className="flex gap-3">
        {THEMES.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            variant="outline"
            className={cn(
              "flex flex-col items-center gap-2 h-auto py-3 px-5",
              mounted && theme === value && "border-foreground bg-muted"
            )}
            onClick={() => setTheme(value)}
          >
            <Icon className="h-4 w-4" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
