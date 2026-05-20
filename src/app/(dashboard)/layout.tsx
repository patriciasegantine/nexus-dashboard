'use client'

import { useApp } from '@/contexts/app-context'
import { cn } from '@/lib/utils'
import { Sidebar } from "@/components/sidebar/sidebar"
import { WelcomeModal } from "@/components/welcome/welcome-modal"
import React from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useApp()

  return (
    <div className="min-h-screen bg-background mt-8">
      <WelcomeModal />
      <div className="flex">
        <Sidebar />
        <main
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out",
            isCollapsed
              ? "ml-[70px] w-[calc(100%-70px)]"
              : "ml-64 w-[calc(100%-256px)]"
          )}
        >
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
