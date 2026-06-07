import type React from "react"

type AuthFormShellProps = {
  title: string
  subtitle: string
  children: React.ReactNode
}

export function AuthFormShell({ title, subtitle, children }: AuthFormShellProps) {
  return (
    <div className="w-full max-w-sm space-y-5">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-light">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}
