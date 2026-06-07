'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface AppContextType {
  theme: 'light' | 'dark' | 'system'
  isCollapsed: boolean
  isMobileSidebarOpen: boolean
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleSidebar: () => void
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({children}: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
    if (storedTheme) setTheme(storedTheme)
    const storedCollapsed = localStorage.getItem('sidebarCollapsed')
    if (storedCollapsed === 'true') setIsCollapsed(true)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('sidebarCollapsed', String(isCollapsed))
  }, [isCollapsed, mounted])

  useEffect(() => {
    if (!isMobileSidebarOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileSidebarOpen])
  
  const toggleSidebar = () => setIsCollapsed(prev => !prev)
  const toggleMobileSidebar = () => setIsMobileSidebarOpen(prev => !prev)
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false)
  
  return (
    <AppContext.Provider
      value={{
        theme,
        isCollapsed,
        isMobileSidebarOpen,
        setTheme,
        toggleSidebar,
        toggleMobileSidebar,
        closeMobileSidebar
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
