import { create } from "zustand"
import { overviewAlerts, overviewLifeScore, overviewMetrics, overviewPriorities, overviewRecentActivity, overviewSchedule, overviewWeeklyProgress } from "@/data/mock/overview"
import type { AttentionAlert, LifeScore, OverviewMetric, PriorityTask, RecentActivityItem, ScheduleItem, WeeklyProgressDatum } from "@/types/overview"

interface OverviewStore {
  priorities: PriorityTask[]
  lifeScore: LifeScore
  metrics: OverviewMetric[]
  schedule: ScheduleItem[]
  alerts: AttentionAlert[]
  weeklyProgress: WeeklyProgressDatum[]
  recentActivity: RecentActivityItem[]
  togglePriority: (id: string) => void
  addPriority: (task: PriorityTask) => void
}

export const useOverviewStore = create<OverviewStore>((set) => ({
  priorities: structuredClone(overviewPriorities),
  lifeScore: structuredClone(overviewLifeScore),
  metrics: structuredClone(overviewMetrics),
  schedule: structuredClone(overviewSchedule),
  alerts: structuredClone(overviewAlerts),
  weeklyProgress: structuredClone(overviewWeeklyProgress),
  recentActivity: structuredClone(overviewRecentActivity),
  togglePriority: (id) => set((state) => ({ priorities: state.priorities.map((task) => task.id === id ? { ...task, completed: !task.completed } : task) })),
  addPriority: (task) => set((state) => ({ priorities: [task, ...state.priorities] })),
}))
