import type {
  AttentionAlert,
  LifeScore,
  OverviewMetric,
  PriorityTask,
  RecentActivityItem,
  ScheduleItem,
  WeeklyProgressDatum,
} from "@/types/overview";

export interface OverviewSnapshot {
  priorities: PriorityTask[];
  lifeScore: LifeScore;
  metrics: OverviewMetric[];
  schedule: ScheduleItem[];
  alerts: AttentionAlert[];
  weeklyProgress: WeeklyProgressDatum[];
  recentActivity: RecentActivityItem[];
}

export interface OverviewService {
  getSnapshot(): Promise<OverviewSnapshot>;
}
