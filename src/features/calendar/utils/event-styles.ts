import type { CalendarEvent } from "@/types/calendar";

export const calendarEventStyles: Record<CalendarEvent["type"], string> = {
  study: "border-indigo-400/20 bg-indigo-400/10 text-indigo-200",
  workout: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  interview: "border-violet-400/20 bg-violet-400/10 text-violet-200",
  bill: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  project: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  personal: "border-slate-400/20 bg-slate-400/10 text-slate-200",
};
