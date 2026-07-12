import {
  addDays,
  addMonths,
  addWeeks,
  differenceInMinutes,
  endOfDay,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import {
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";

import { MetricCard } from "@/components/common/metric-card";
import { PageHeader } from "@/components/common/page-header";
import { SectionCard } from "@/components/common/section-card";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddEventDialog } from "@/features/calendar/components/add-event-dialog";
import { AgendaView } from "@/features/calendar/components/agenda-view";
import { MonthView } from "@/features/calendar/components/month-view";
import { WeekView } from "@/features/calendar/components/week-view";
import { calendarEventStyles } from "@/features/calendar/utils/event-styles";
import { useCalendarStore } from "@/store/calendar-store";
import type {
  CalendarEvent,
  CalendarEventType,
  CalendarView,
  CreateCalendarEventInput,
} from "@/types/calendar";

const nexusToday = new Date("2026-07-12T12:00:00+05:30");

const eventLabels: Record<CalendarEventType, string> = {
  study: "Study",
  workout: "Workout",
  interview: "Interview",
  bill: "Bills",
  project: "Projects",
  personal: "Personal",
};

export function CalendarPage() {
  const events = useCalendarStore((state) => state.events);
  const addEvent = useCalendarStore((state) => state.addEvent);
  const [currentDate, setCurrentDate] = useState(nexusToday);
  const [view, setView] = useState<CalendarView>("month");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  const visibleEvents = useMemo(() => {
    if (view !== "agenda") return events;
    return events.filter((event) =>
      isWithinInterval(parseISO(event.start), {
        start: startOfDay(currentDate),
        end: endOfDay(addDays(currentDate, 13)),
      }),
    );
  }, [currentDate, events, view]);

  const upcoming = useMemo(
    () =>
      events
        .filter(
          (event) => !isBefore(parseISO(event.start), startOfDay(nexusToday)),
        )
        .sort((a, b) => a.start.localeCompare(b.start))
        .slice(0, 6),
    [events],
  );

  const todayEvents = events.filter((event) =>
    isSameDay(parseISO(event.start), nexusToday),
  );
  const weekEnd = endOfDay(
    addDays(startOfWeek(nexusToday, { weekStartsOn: 1 }), 6),
  );
  const focusMinutes = events
    .filter(
      (event) =>
        !event.allDay &&
        isWithinInterval(parseISO(event.start), {
          start: startOfWeek(nexusToday, { weekStartsOn: 1 }),
          end: weekEnd,
        }),
    )
    .reduce(
      (total, event) =>
        total + differenceInMinutes(parseISO(event.end), parseISO(event.start)),
      0,
    );

  const moveDate = (direction: -1 | 1) => {
    setCurrentDate((date) => {
      if (view === "month")
        return direction === 1 ? addMonths(date, 1) : subMonths(date, 1);
      return direction === 1 ? addWeeks(date, 1) : subWeeks(date, 1);
    });
  };

  const handleAddEvent = async (input: CreateCalendarEventInput) => {
    const event = addEvent(input);
    setCurrentDate(parseISO(event.start));
    return event;
  };

  const rangeLabel =
    view === "month"
      ? format(currentDate, "MMMM yyyy")
      : view === "week"
        ? `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d")} – ${format(addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 6), "MMM d, yyyy")}`
        : `${format(currentDate, "MMM d")} – ${format(addDays(currentDate, 13), "MMM d, yyyy")}`;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Time architecture"
        title="Calendar"
        description="See commitments, protect focus, and keep deadlines from becoming surprises."
        actions={<AddEventDialog onAdd={handleAddEvent} />}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Today"
          value={todayEvents.length}
          detail="Scheduled commitments"
          icon={CalendarCheck2}
          accent="primary"
        />
        <MetricCard
          label="Focus time"
          value={`${Math.round((focusMinutes / 60) * 10) / 10}h`}
          detail="Planned this week"
          icon={Clock3}
          accent="success"
        />
        <MetricCard
          label="Interviews"
          value={
            events.filter(
              (event) =>
                event.type === "interview" &&
                isAfter(parseISO(event.start), nexusToday),
            ).length
          }
          detail="Upcoming this month"
          icon={Video}
          accent="neutral"
        />
        <MetricCard
          label="Deadlines & bills"
          value={
            events.filter(
              (event) =>
                ["project", "bill"].includes(event.type) &&
                isAfter(parseISO(event.start), nexusToday),
            ).length
          }
          detail="Upcoming milestones"
          accent="warning"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <SectionCard
          contentClassName="p-0"
          action={
            <Tabs
              value={view}
              onValueChange={(value) => setView(value as CalendarView)}
            >
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="agenda">Agenda</TabsTrigger>
              </TabsList>
            </Tabs>
          }
        >
          <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => moveDate(-1)}
                aria-label="Previous period"
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(nexusToday)}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => moveDate(1)}
                aria-label="Next period"
              >
                <ChevronRight />
              </Button>
            </div>
            <h2 className="font-display text-base font-semibold tracking-tight sm:text-lg">
              {rangeLabel}
            </h2>
          </div>

          {view === "month" ? (
            <MonthView
              currentDate={currentDate}
              events={visibleEvents}
              onSelectEvent={setSelectedEvent}
            />
          ) : view === "week" ? (
            <WeekView
              currentDate={currentDate}
              events={visibleEvents}
              onSelectEvent={setSelectedEvent}
            />
          ) : (
            <div className="p-4 sm:p-5">
              <AgendaView
                events={visibleEvents}
                onSelectEvent={setSelectedEvent}
              />
            </div>
          )}
        </SectionCard>

        <aside className="space-y-5">
          <SectionCard
            title="Coming up"
            description="Your next six commitments"
          >
            <div className="space-y-1">
              {upcoming.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setSelectedEvent(event)}
                  className="flex w-full items-start gap-3 rounded-xl px-2 py-3 text-left transition hover:bg-secondary/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span
                    className={`mt-1.5 size-2 shrink-0 rounded-full border ${calendarEventStyles[event.type]}`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {event.title}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {format(
                        parseISO(event.start),
                        event.allDay ? "EEE, MMM d" : "EEE, MMM d · h:mm a",
                      )}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Calendar key">
            <div className="grid grid-cols-2 gap-3 text-xs">
              {(Object.keys(eventLabels) as CalendarEventType[]).map((type) => (
                <div
                  key={type}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <span
                    className={`size-2.5 rounded-full border ${calendarEventStyles[type]}`}
                  />
                  {eventLabels[type]}
                </div>
              ))}
            </div>
            <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
              Phase 1 calendar data is local. A service adapter is ready for a
              future calendar provider.
            </p>
          </SectionCard>
        </aside>
      </div>

      <Dialog
        open={Boolean(selectedEvent)}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      >
        <DialogContent>
          {selectedEvent ? (
            <>
              <DialogHeader>
                <div className="mb-2">
                  <StatusBadge
                    tone={
                      selectedEvent.type === "bill"
                        ? "warning"
                        : selectedEvent.type === "interview"
                          ? "info"
                          : "neutral"
                    }
                  >
                    {selectedEvent.type}
                  </StatusBadge>
                </div>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
                <DialogDescription>
                  {selectedEvent.description ??
                    "No additional notes for this event."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 rounded-xl bg-secondary/35 p-4 text-sm">
                <div className="flex items-center gap-3">
                  <CalendarCheck2 className="size-4 text-primary" />
                  <span>
                    {format(
                      parseISO(selectedEvent.start),
                      selectedEvent.allDay
                        ? "EEEE, MMMM d, yyyy"
                        : "EEEE, MMMM d · h:mm a",
                    )}
                  </span>
                </div>
                {!selectedEvent.allDay ? (
                  <div className="flex items-center gap-3">
                    <Clock3 className="size-4 text-primary" />
                    <span>
                      Ends {format(parseISO(selectedEvent.end), "h:mm a")}
                    </span>
                  </div>
                ) : null}
                {selectedEvent.location ? (
                  <div className="flex items-center gap-3">
                    <MapPin className="size-4 text-primary" />
                    <span>{selectedEvent.location}</span>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CalendarPage;
