import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type Tone = "neutral" | "info" | "success" | "warning" | "danger"
interface StatusBadgeProps { children?: ReactNode; status?: string; tone?: Tone; className?: string }

function inferTone(status: string): Tone {
  const value = status.toLowerCase()
  if (["complete", "completed", "active", "healthy", "paid", "offer", "solved", "on track"].some((term) => value.includes(term))) return "success"
  if (["blocked", "overdue", "rejected", "failed", "high"].some((term) => value.includes(term))) return "danger"
  if (["pending", "review", "medium", "follow", "due", "progress"].some((term) => value.includes(term))) return "warning"
  if (["applied", "interview", "planned", "scheduled", "priority"].some((term) => value.includes(term))) return "info"
  return "neutral"
}

const tones: Record<Tone, string> = {
  neutral: "border-white/[0.08] bg-secondary/70 text-muted-foreground",
  info: "border-primary/15 bg-primary/10 text-indigo-300",
  success: "border-success/15 bg-success/10 text-emerald-300",
  warning: "border-warning/15 bg-warning/10 text-amber-300",
  danger: "border-destructive/15 bg-destructive/10 text-red-300",
}

export function StatusBadge({ children, status, tone, className }: StatusBadgeProps) {
  const content = children ?? status ?? "Unknown"
  const resolvedTone = tone ?? inferTone(String(content))
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize leading-none", tones[resolvedTone], className)}>{content}</span>
}
