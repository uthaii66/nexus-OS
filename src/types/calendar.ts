export type CalendarEventType =
  | "study"
  | "workout"
  | "interview"
  | "bill"
  | "project"
  | "personal"

export type CalendarView = "month" | "week" | "agenda"

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  type: CalendarEventType
  start: string
  end: string
  allDay: boolean
  location?: string
  projectId?: string
  completed?: boolean
}

export interface CreateCalendarEventInput {
  title: string
  description?: string
  type: CalendarEventType
  start: string
  end: string
  allDay?: boolean
  location?: string
}

export interface CalendarDateRange {
  from: string
  to: string
}
