import { create } from "zustand";

import { mockCalendarEvents } from "@/data/mock/calendar";
import type { CalendarEvent, CreateCalendarEventInput } from "@/types/calendar";

interface CalendarState {
  events: CalendarEvent[];
  addEvent: (input: CreateCalendarEventInput) => CalendarEvent;
  updateEvent: (
    eventId: string,
    input: Partial<CreateCalendarEventInput>,
  ) => void;
  deleteEvent: (eventId: string) => void;
  resetCalendar: () => void;
}

const createEventId = () =>
  `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const initialEvents = () => structuredClone(mockCalendarEvents);

export const useCalendarStore = create<CalendarState>((set) => ({
  events: initialEvents(),
  addEvent: (input) => {
    const event: CalendarEvent = {
      id: createEventId(),
      ...input,
      allDay: input.allDay ?? false,
    };
    set((state) => ({ events: [...state.events, event] }));
    return event;
  },
  updateEvent: (eventId, input) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === eventId ? { ...event, ...input } : event,
      ),
    })),
  deleteEvent: (eventId) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== eventId),
    })),
  resetCalendar: () => set({ events: initialEvents() }),
}));
