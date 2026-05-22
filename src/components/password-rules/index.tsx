import { CheckCircle2, Circle } from "lucide-react"
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
        "overflow-hidden rounded-lg border bg-muted/30 transition-all duration-300",
        visible ? "max-h-56 opacity-100 p-4" : "max-h-0 opacity-0 p-0 border-transparent"
      )}
    >
      <p className="mb-3 text-xs text-muted-foreground">
        Password strength: {completed}/{rules.length}
      </p>

      {rules.map((rule, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center gap-2 py-1 text-sm transition-all duration-200",
            rule.valid ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {rule.valid ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground/50" />
          )}
          <span>{rule.text}</span>
        </div>
      ))}
    </div>
  )
}
