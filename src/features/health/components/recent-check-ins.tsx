import { format, parseISO } from "date-fns"
import {
  Activity,
  ClipboardCheck,
  Droplets,
  Dumbbell,
  Footprints,
  Gauge,
  MoonStar,
  Salad,
  Scale,
  Smile,
} from "lucide-react"

import {
  ActivityTimeline,
  type TimelineItem,
} from "@/components/common/activity-timeline"
import { SectionCard } from "@/components/common/section-card"
import type { HealthLog } from "@/types/health"

interface RecentCheckInsProps {
  logs: HealthLog[]
}

function toTimelineItem(log: HealthLog): TimelineItem {
  const time = format(parseISO(log.createdAt), "MMM d, h:mm a")
  switch (log.type) {
    case "daily-check-in": {
      const completed = [
        log.workoutStatus,
        log.dietStatus,
        log.supplementsStatus,
        log.skincareStatus,
        log.smokingStatus,
        log.dsaStatus,
        log.skillImprovementStatus,
      ].filter((status) => status === "done").length
      return {
        id: log.id,
        title: `Daily tracker · ${completed}/7 habits completed`,
        description: `Focus ${log.focus}/5 · Mood ${log.mood}/5 · Energy ${log.energy}/5`,
        time,
        icon: ClipboardCheck,
        tone: completed >= 5 ? "success" : "warning",
      }
    }
    case "weight":
      return {
        id: log.id,
        title: `Weight logged · ${log.weightKg} kg`,
        description: log.note,
        time,
        icon: Scale,
        tone: "primary",
      }
    case "meal":
      return {
        id: log.id,
        title: log.mealName,
        description: `${log.calories} kcal · ${log.proteinGrams} g protein`,
        time,
        icon: Salad,
        tone: "success",
      }
    case "workout":
      return {
        id: log.id,
        title: log.workoutName,
        description: `${log.durationMinutes} minutes · ${log.intensity} intensity`,
        time,
        icon: Dumbbell,
        tone: "primary",
      }
    case "steps":
      return {
        id: log.id,
        title: `${log.steps.toLocaleString()} steps logged`,
        time,
        icon: Footprints,
        tone: "success",
      }
    case "sleep":
      return {
        id: log.id,
        title: `${log.hours} hours of sleep`,
        description: `Quality ${log.quality} of 5`,
        time,
        icon: MoonStar,
        tone: "primary",
      }
    case "water":
      return {
        id: log.id,
        title: `${log.liters} L water logged`,
        time,
        icon: Droplets,
        tone: "neutral",
      }
    case "mood":
      return {
        id: log.id,
        title: `Mood ${log.mood}/5 · Energy ${log.energy}/5`,
        description: log.note,
        time,
        icon: Smile,
        tone: "warning",
      }
    default:
      return {
        id: "unknown",
        title: "Health activity",
        time,
        icon: Activity,
        tone: "neutral",
      }
  }
}

export function RecentCheckIns({ logs }: RecentCheckInsProps) {
  const items = [...logs]
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, 7)
    .map(toTimelineItem)

  return (
    <SectionCard
      title="Recent check-ins"
      description="The latest health entries from this session"
      action={
        <Gauge className="size-4 text-muted-foreground" aria-hidden="true" />
      }
    >
      <ActivityTimeline items={items} />
    </SectionCard>
  )
}
