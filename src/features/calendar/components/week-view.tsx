import { addDays, format, isSameDay, parseISO, startOfWeek } from "date-fns"

import { EventChip } from "@/features/calendar/components/event-chip"
import type { CalendarEvent } from "@/types/calendar"

interface WeekViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onSelectEvent: (event: CalendarEvent) => void
}

export function WeekView({
  currentDate,
  events,
  onSelectEvent,
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const days = Array.from({ length: 7 }, (_, index) =>
    addDays(weekStart, index),
  )

  return (
    <div className="overflow-x-auto">
      <div className="grid min-h-[480px] min-w-[840px] grid-cols-7 divide-x divide-border">
        {days.map((day) => {
          const dayEvents = events
            .filter((event) => isSameDay(parseISO(event.start), day))
            .sort((a, b) => a.start.localeCompare(b.start))
          const today = isSameDay(day, new Date("2026-07-12T12:00:00+05:30"))
          return (
            <section key={day.toISOString()} className="px-2.5 py-3">
              <div
                className={`mb-4 rounded-xl px-2 py-2 text-center ${today ? "bg-primary/12 text-primary" : ""}`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {format(day, "EEE")}
                </p>
                <p className="mt-1 text-lg font-semibold tabular-nums">
                  {format(day, "d")}
                </p>
              </div>
              <div className="space-y-2">
                {dayEvents.map((event) => (
                  <EventChip
                    key={event.id}
                    event={event}
                    onSelect={onSelectEvent}
                  />
                ))}
                {dayEvents.length === 0 ? (
                  <p className="pt-4 text-center text-[11px] text-muted-foreground/60">
                    Open
                  </p>
                ) : null}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
