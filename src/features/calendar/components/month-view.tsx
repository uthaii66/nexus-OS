import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { EventChip } from "@/features/calendar/components/event-chip";
import type { CalendarEvent } from "@/types/calendar";

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

export function MonthView({
  currentDate,
  events,
  onSelectEvent,
}: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const days = eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 }),
  });

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px]">
        <div className="grid grid-cols-7 border-b border-border">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div
              key={day}
              className="px-2 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const dayEvents = events
              .filter((event) => isSameDay(parseISO(event.start), day))
              .sort((a, b) => a.start.localeCompare(b.start));
            const today = isSameDay(day, new Date("2026-07-12T12:00:00+05:30"));
            return (
              <div
                key={day.toISOString()}
                className={`min-h-32 border-b border-r border-border p-1.5 ${isSameMonth(day, currentDate) ? "bg-card/15" : "bg-background/35 text-muted-foreground/45"}`}
              >
                <span
                  className={`mb-1.5 flex size-7 items-center justify-center rounded-lg text-xs tabular-nums ${today ? "bg-primary font-semibold text-primary-foreground" : ""}`}
                >
                  {format(day, "d")}
                </span>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <EventChip
                      key={event.id}
                      event={event}
                      compact
                      onSelect={onSelectEvent}
                    />
                  ))}
                  {dayEvents.length > 3 ? (
                    <p className="px-1 text-[10px] text-muted-foreground">
                      +{dayEvents.length - 3} more
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
