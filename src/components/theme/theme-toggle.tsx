'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const {theme, setTheme} = useTheme()
  
  // Evita hidratação incorreta
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Sun className="h-[1.35rem] w-[1.35rem] rotate-0 scale-100 transition-all"/>
      ) : (
        <Moon className="h-[1.35rem] w-[1.35rem] rotate-0 scale-100 transition-all"/>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
