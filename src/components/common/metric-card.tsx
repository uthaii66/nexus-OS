import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { TrendIndicator } from "@/components/common/trend-indicator"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  label?: string
  title?: string
  value: string | number
  detail?: string
  trend?: string
  change?: string
  trendDirection?: "up" | "down" | "neutral"
  icon?: LucideIcon
  accent?: "primary" | "success" | "warning" | "danger" | "neutral"
  children?: ReactNode
  className?: string
}

const accents = {
  primary: "bg-primary/12 text-indigo-300 ring-primary/15",
  success: "bg-success/10 text-emerald-300 ring-success/15",
  warning: "bg-warning/10 text-amber-300 ring-warning/15",
  danger: "bg-destructive/10 text-red-300 ring-destructive/15",
  neutral: "bg-secondary text-muted-foreground ring-white/5",
}

export function MetricCard({ label, title, value, detail, trend, change, trendDirection = "neutral", icon: Icon, accent = "primary", children, className }: MetricCardProps) {
  return (
    <Card className={cn("group relative overflow-hidden p-4 transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.11] sm:p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{label ?? title}</p>
          <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.035em] text-foreground">{value}</p>
        </div>
        {Icon ? <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl ring-1", accents[accent])}><Icon className="size-4" aria-hidden="true" /></span> : null}
      </div>
      <div className="mt-3 flex min-h-5 items-center gap-2">
        {trend || change ? <TrendIndicator value={trend ?? change ?? ""} direction={trendDirection} /> : null}
        {detail ? <span className="truncate text-xs text-muted-foreground">{detail}</span> : null}
      </div>
      {children ? <div className="mt-3">{children}</div> : null}
    </Card>
  )
}
