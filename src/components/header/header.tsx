'use client'

import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { AppRoutes } from "@/constants/routes"
import { UserNav } from "@/components/header/user-nav"
import { Button } from "@/components/ui/button"
import { Bell, Menu } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const { data: session, status } = useSession()
  const { toggleMobileSidebar } = useApp()

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-40">
      <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2 md:hidden"
            onClick={toggleMobileSidebar}
            aria-label="Open sidebar menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Link href={AppRoutes.DASHBOARD.HOME} className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Nexus" width={24} height={24} className="rounded" />
            <span className="text-sm font-medium">Nexus</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <Button variant="ghost" size="icon" className="relative h-10 w-10" aria-label="Notifications">
            <Bell className="h-7 w-7" />
            <Badge className="absolute -right-1 -top-1 h-5 min-w-5 px-1 text-[10px] leading-none">
              3
            </Badge>
          </Button>
          {status === 'loading' && (
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          )}
          {status === 'authenticated' && session?.user && <UserNav user={session.user} />}
        </div>
      </div>
    </header>
  )
}
