export type PriorityLevel = "high" | "medium" | "low";
export interface PriorityTask {
  id: string;
  title: string;
  category: string;
  duration: string;
  priority: PriorityLevel;
  completed: boolean;
}
export interface LifeScoreCategory {
  name: "Health" | "Finance" | "Career" | "Learning" | "Projects";
  score: number;
  change: number;
}
export interface LifeScore {
  overall: number;
  weeklyChange: number;
  categories: LifeScoreCategory[];
}
export type OverviewMetricId =
  | "spending"
  | "debt"
  | "weight"
  | "calories"
  | "streak"
  | "problems"
  | "applications"
  | "projects";
export interface OverviewMetric {
  id: OverviewMetricId;
  label: string;
  value: string;
  trend: string;
  direction: "up" | "down" | "neutral";
  positive?: boolean;
  detail: string;
  sparkline: number[];
}
export interface ScheduleItem {
  id: string;
  title: string;
  category: "Learning" | "Health" | "Career" | "Finance" | "Projects";
  start: string;
  end: string;
  date: string;
  location?: string;
}
export interface AttentionAlert {
  id: string;
  title: string;
  description: string;
  severity: "info" | "warning" | "danger";
  action: string;
  route: string;
}
export interface WeeklyProgressDatum {
  day: string;
  planned: number;
  completed: number;
  studyMinutes: number;
  workout: number;
  spend: number;
  budget: number;
}
export interface RecentActivityItem {
  id: string;
  type: "health" | "finance" | "learning" | "career" | "project";
  title: string;
  description: string;
  time: string;
}
