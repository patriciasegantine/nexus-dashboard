'use client'

import { useApp } from '@/contexts/app-context'
import { cn } from '@/lib/utils'
import { Sidebar } from "@/components/sidebar/sidebar"
import { WelcomeModal } from "@/components/welcome/welcome-modal"
import React, { Suspense } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useApp()

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      <Suspense fallback={null}>
        <WelcomeModal />
      </Suspense>
      <div className="flex">
        <Sidebar />
        <main
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out",
            isCollapsed
              ? "md:ml-[70px]"
              : "md:ml-64"
          )}
        >
          <div className="container mx-auto p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
