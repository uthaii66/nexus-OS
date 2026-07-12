import type { ReactNode } from "react"
import { SectionCard } from "@/components/common/section-card"
import { cn } from "@/lib/utils"

interface ChartCardProps {
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
  height?: number | string
}

export function ChartCard({ height, children, contentClassName, ...props }: ChartCardProps) {
  return <SectionCard {...props} contentClassName={cn("min-w-0", contentClassName)}><div style={height ? { height } : undefined} className={height ? "w-full" : undefined}>{children}</div></SectionCard>
}
