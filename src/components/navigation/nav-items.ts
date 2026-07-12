import type { LucideIcon } from "lucide-react"
import { BriefcaseBusiness, CalendarDays, CircleDollarSign, FolderKanban, GraduationCap, HeartPulse, LayoutDashboard, Lightbulb, Settings } from "lucide-react"

export interface NavigationItem { label: string; path: string; icon: LucideIcon; description: string }
export const navigationItems: NavigationItem[] = [
  { label: "Overview", path: "/", icon: LayoutDashboard, description: "Your daily command center" },
  { label: "Finance", path: "/finance", icon: CircleDollarSign, description: "Spending, savings, and debt" },
  { label: "Health", path: "/health", icon: HeartPulse, description: "Fitness, recovery, and habits" },
  { label: "Learning", path: "/learning", icon: GraduationCap, description: "Study plans and interview prep" },
  { label: "Career", path: "/career", icon: BriefcaseBusiness, description: "Applications and interviews" },
  { label: "Projects", path: "/projects", icon: FolderKanban, description: "Builds, tasks, and milestones" },
  { label: "Calendar", path: "/calendar", icon: CalendarDays, description: "Your unified schedule" },
  { label: "Insights", path: "/insights", icon: Lightbulb, description: "Patterns across your life data" },
  { label: "Settings", path: "/settings", icon: Settings, description: "Personalize your workspace" },
]
