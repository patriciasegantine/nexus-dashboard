import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import React from "react"
import { Toaster } from "@/components/ui/toaster"
import { QueryProvider } from "@/providers/query-provider"
import { AuthProvider } from "@/providers/auth-provider"
import { ThemeProvider } from '@/components/theme/theme-provider'
import { AppProvider } from "@/contexts/app-context"
import { Header } from "@/components/header/header"

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
  title: {
    default: 'Nexus',
    template: '%s | Nexus'
  },
  description: 'Connect and organize your workflow with Nexus - The central hub for your board and projects.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body className={inter.className}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <QueryProvider>
          <AppProvider>
            <Header/>
            <main>
              {children}
            </main>
          </AppProvider>
          <Toaster/>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
    </body>
    </html>
  )
}
