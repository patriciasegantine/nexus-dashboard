'use client'

import { useApp } from '@/contexts/app-context'
import { cn } from '@/lib/utils'
import { Sidebar } from "@/components/sidebar/sidebar"
import { Header } from "@/components/header/header"
import React from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useApp()

  return (
    <div className="min-h-screen bg-background pt-16">
      <Header />
      <div className="flex">
        <Sidebar />
        <main
          className={cn(
            "flex-1 min-w-0 transition-all duration-300 ease-in-out",
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
