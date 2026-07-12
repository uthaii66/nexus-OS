import { mockCalendarEvents } from "@/data/mock/calendar"
import type { CalendarService } from "@/services/calendar/calendar-service"
import type {
  CalendarDateRange,
  CalendarEvent,
  CreateCalendarEventInput,
} from "@/types/calendar"

const eventId = () =>
  `event-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export class MockCalendarService implements CalendarService {
  private events = structuredClone(mockCalendarEvents)

  async getEvents(range?: CalendarDateRange) {
    const events = range
      ? this.events.filter(
          (event) => event.start <= range.to && event.end >= range.from,
        )
      : this.events
    return structuredClone(events)
  }

  async createEvent(input: CreateCalendarEventInput): Promise<CalendarEvent> {
    const event: CalendarEvent = {
      id: eventId(),
      ...input,
      allDay: input.allDay ?? false,
    }
    this.events.push(event)
    return structuredClone(event)
  }

  async updateEvent(
    eventIdToUpdate: string,
    input: Partial<CreateCalendarEventInput>,
  ) {
    const event = this.events.find((item) => item.id === eventIdToUpdate)
    if (!event) throw new Error(`Event ${eventIdToUpdate} was not found.`)
    Object.assign(event, input)
    return structuredClone(event)
  }

  async deleteEvent(eventIdToDelete: string) {
    this.events = this.events.filter((event) => event.id !== eventIdToDelete)
  }
}

export const calendarService: CalendarService = new MockCalendarService()
