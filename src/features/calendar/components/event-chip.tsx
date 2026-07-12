import { format, parseISO } from "date-fns"

import { calendarEventStyles } from "@/features/calendar/utils/event-styles"
import type { CalendarEvent } from "@/types/calendar"

interface EventChipProps {
  event: CalendarEvent
  compact?: boolean
  onSelect: (event: CalendarEvent) => void
}

export function EventChip({
  event,
  compact = false,
  onSelect,
}: EventChipProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      className={`w-full rounded-lg border text-left transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${calendarEventStyles[event.type]} ${compact ? "px-1.5 py-1 text-[10px]" : "px-2.5 py-2 text-xs"}`}
    >
      {!event.allDay ? (
        <span className="mr-1.5 opacity-70">
          {format(parseISO(event.start), "h:mm")}
        </span>
      ) : null}
      <span className="font-medium">{event.title}</span>
    </button>
  )
}
