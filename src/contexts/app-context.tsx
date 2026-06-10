'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface AppContextType {
  isCollapsed: boolean
  isMobileSidebarOpen: boolean
  toggleSidebar: () => void
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const storedCollapsed = localStorage.getItem('sidebarCollapsed')
    if (storedCollapsed === 'true') setIsCollapsed(true)
    setMounted(true)
  }, [])

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
        isCollapsed,
        isMobileSidebarOpen,
        toggleSidebar,
        toggleMobileSidebar,
        closeMobileSidebar,
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
