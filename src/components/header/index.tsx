'use client'

import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { AppRoutes } from "@/constants/routes"
import { UserNav } from "@/components/header/user-nav"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useApp } from "@/contexts/app-context"

export function Header() {
  const { data: session } = useSession()
  const { toggleMobileSidebar } = useApp()

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-40">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileSidebar}
            aria-label="Open sidebar menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href={AppRoutes.DASHBOARD.HOME} className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Nexus" width={24} height={24} className="rounded" />
            <span className="text-sm font-medium">Nexus</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {session?.user ? (
            <UserNav user={session.user} />
          ) : (
            <Link
              href={AppRoutes.AUTH.LOGIN}
              className="text-sm font-medium hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
