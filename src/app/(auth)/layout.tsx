import React from "react"
import Link from "next/link"
import { AppRoutes } from "@/constants/routes"
import { ThemeToggle } from "@/components/theme/theme-toggle"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 h-16">
        <Link href={AppRoutes.AUTH.LOGIN} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center">
            <span className="text-background text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-sm">Nexus</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-start sm:items-center justify-center p-4 pt-8 sm:pt-4">
        {children}
      </main>
    </div>
  )
}
