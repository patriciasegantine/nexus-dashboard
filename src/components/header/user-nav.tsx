'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { AppRoutes } from "@/constants/routes"
import { Moon, Plus, Settings, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface UserNavProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function UserNav({ user }: UserNavProps) {
  const initials = getUserInitials(user.name)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User avatar"} />
            <AvatarFallback className="text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mounted && (
          <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            Toggle theme
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href={AppRoutes.DASHBOARD.WORK_ITEMS}>
            <Plus className="h-4 w-4" />
            New task
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={AppRoutes.DASHBOARD.SETTINGS}>
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function getUserInitials(name?: string | null) {
  if (!name) return "U"

  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "U"

  const first = parts[0][0] ?? ""
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : ""

  return `${first}${last}`.toUpperCase()
}
