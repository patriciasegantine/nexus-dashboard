"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

const DURATION = 5000

function ToastItem({ id, title, description, action, dismiss, ...props }: {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  dismiss: () => void
  [key: string]: unknown
}) {
  useEffect(() => {
    const timer = setTimeout(dismiss, DURATION)
    return () => clearTimeout(timer)
  }, [dismiss])

  return (
    <Toast {...props}>
      <div className="grid gap-1">
        {title && <ToastTitle>{title}</ToastTitle>}
        {description && <ToastDescription>{description}</ToastDescription>}
      </div>
      {action}
      <ToastClose />
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-foreground/20 rounded-full"
        style={{ animation: `toast-progress ${DURATION}ms linear forwards` }}
      />
    </Toast>
  )
}

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <ToastItem
          key={id}
          id={id}
          title={title}
          description={description}
          action={action}
          dismiss={() => dismiss(id)}
          {...props}
        />
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
