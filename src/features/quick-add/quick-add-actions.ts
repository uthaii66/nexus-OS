import type { LucideIcon } from "lucide-react"
import { Banknote, BriefcaseBusiness, CalendarPlus, Dumbbell, FilePenLine, FolderPlus, Receipt, RefreshCcw, Salad, Scale, TimerReset } from "lucide-react"
import type { QuickAddAction } from "@/types/quick-add"

export interface QuickAddActionConfig { id: QuickAddAction; label: string; description: string; icon: LucideIcon; group: "Money" | "Health" | "Growth" | "Work" | "General" }
export const quickAddActions: QuickAddActionConfig[] = [
  { id: "expense", label: "Add expense", description: "Record a purchase or bill", icon: Receipt, group: "Money" },
  { id: "income", label: "Add income", description: "Record salary or other income", icon: Banknote, group: "Money" },
  { id: "weight", label: "Log weight", description: "Add today’s measurement", icon: Scale, group: "Health" },
  { id: "meal", label: "Log meal", description: "Track calories and protein", icon: Salad, group: "Health" },
  { id: "workout", label: "Log workout", description: "Record a training session", icon: Dumbbell, group: "Health" },
  { id: "study-session", label: "Study session", description: "Add focused learning time", icon: TimerReset, group: "Growth" },
  { id: "job-application", label: "Job application", description: "Track a new opportunity", icon: BriefcaseBusiness, group: "Work" },
  { id: "application-update", label: "Update application", description: "Move an application forward", icon: RefreshCcw, group: "Work" },
  { id: "project-task", label: "Project task", description: "Create a scoped next action", icon: FolderPlus, group: "Work" },
  { id: "calendar-event", label: "Calendar event", description: "Block time or add a deadline", icon: CalendarPlus, group: "General" },
  { id: "note", label: "Quick note", description: "Capture a thought or decision", icon: FilePenLine, group: "General" },
]
