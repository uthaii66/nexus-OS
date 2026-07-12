import type {
  CalendarDateRange,
  CalendarEvent,
  CreateCalendarEventInput,
} from "@/types/calendar"

export interface CalendarService {
  getEvents(range?: CalendarDateRange): Promise<CalendarEvent[]>
  createEvent(input: CreateCalendarEventInput): Promise<CalendarEvent>
  updateEvent(
    eventId: string,
    input: Partial<CreateCalendarEventInput>,
  ): Promise<CalendarEvent>
  deleteEvent(eventId: string): Promise<void>
}
