import type { LucideIcon } from "lucide-react"
import { Activity } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TimelineItem { id: string; title: string; description?: string; time: string; icon?: LucideIcon; tone?: "primary" | "success" | "warning" | "neutral" }
interface ActivityTimelineProps { items: TimelineItem[]; className?: string }
const toneClass = { primary: "bg-primary/15 text-indigo-300", success: "bg-success/10 text-emerald-300", warning: "bg-warning/10 text-amber-300", neutral: "bg-secondary text-muted-foreground" }
export function ActivityTimeline({ items, className }: ActivityTimelineProps) {
  return <ol className={cn("space-y-0", className)}>{items.map((item, index) => { const Icon = item.icon ?? Activity; return <li key={item.id} className="relative flex gap-3 pb-5 last:pb-0">{index < items.length - 1 ? <span className="absolute left-[17px] top-9 h-[calc(100%-1.1rem)] w-px bg-border" /> : null}<span className={cn("relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl", toneClass[item.tone ?? "neutral"])}><Icon className="size-4" /></span><div className="min-w-0 flex-1 pt-0.5"><div className="flex items-start justify-between gap-3"><p className="text-sm font-medium text-foreground">{item.title}</p><time className="shrink-0 text-[11px] text-muted-foreground">{item.time}</time></div>{item.description ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p> : null}</div></li> })}</ol>
}
