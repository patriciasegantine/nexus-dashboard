import { cn } from "@/lib/utils"
import type { PasswordRule } from "@/hooks/use-password-rules"

interface PasswordRulesProps {
  rules: PasswordRule[]
  visible: boolean
}

export function PasswordRules({ rules, visible }: PasswordRulesProps) {
  const completed = rules.filter((rule) => rule.valid).length

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border bg-muted/70 transition-all duration-300",
        visible ? "max-h-80 opacity-100 p-4" : "max-h-0 opacity-0 p-0 border-transparent"
      )}
    >
      <p className="mb-2 text-sm text-muted-foreground">
        Password strength: {completed}/{rules.length}
      </p>

      {rules.map((rule, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center gap-2 py-0.5 text-sm transition-all duration-200",
            rule.valid ? "text-foreground" : "text-muted-foreground"
          )}
        >
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              rule.valid ? "bg-emerald-500" : "bg-muted-foreground/40"
            )}
          />
          <span>{rule.text}</span>
        </div>
      ))}
    </div>
  )
}
