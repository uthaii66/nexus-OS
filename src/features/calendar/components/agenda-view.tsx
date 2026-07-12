import { format, isSameDay, parseISO } from "date-fns"
import { CalendarDays, Clock3, MapPin } from "lucide-react"

import { StatusBadge } from "@/components/common/status-badge"
import type { CalendarEvent } from "@/types/calendar"

interface AgendaViewProps {
  events: CalendarEvent[]
  onSelectEvent: (event: CalendarEvent) => void
}

export function AgendaView({ events, onSelectEvent }: AgendaViewProps) {
  const sorted = [...events].sort((a, b) => a.start.localeCompare(b.start))
  const dates = Array.from(
    new Set(sorted.map((event) => format(parseISO(event.start), "yyyy-MM-dd"))),
  )

  return (
    <div className="space-y-6">
      {dates.map((dateKey) => {
        const date = parseISO(dateKey)
        const dateEvents = sorted.filter((event) =>
          isSameDay(parseISO(event.start), date),
        )
        return (
          <section
            key={dateKey}
            className="grid gap-3 md:grid-cols-[130px_minmax(0,1fr)]"
          >
            <div>
              <p className="text-sm font-semibold">{format(date, "EEEE")}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {format(date, "MMMM d")}
              </p>
            </div>
            <div className="space-y-2">
              {dateEvents.map((event) => (
                <button
                  type="button"
                  key={event.id}
                  onClick={() => onSelectEvent(event)}
                  className="grid w-full gap-3 rounded-xl border border-border bg-background/35 p-3 text-left transition hover:border-white/15 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:items-center"
                >
                  <span className="text-xs font-medium tabular-nums text-muted-foreground">
                    {event.allDay
                      ? "All day"
                      : format(parseISO(event.start), "h:mm a")}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {event.title}
                    </span>
                    <span className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {!event.allDay ? (
                        <span className="flex items-center gap-1">
                          <Clock3 className="size-3" />
                          {format(parseISO(event.end), "h:mm a")}
                        </span>
                      ) : null}
                      {event.location ? (
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {event.location}
                        </span>
                      ) : null}
                    </span>
                  </span>
                  <StatusBadge
                    tone={
                      event.type === "bill"
                        ? "warning"
                        : event.type === "interview"
                          ? "info"
                          : "neutral"
                    }
                  >
                    {event.type}
                  </StatusBadge>
                </button>
              ))}
            </div>
          </section>
        )
      })}
      {events.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          <CalendarDays className="mx-auto mb-3 size-7" /> No events in this
          agenda window.
        </div>
      ) : null}
    </div>
  )
}
