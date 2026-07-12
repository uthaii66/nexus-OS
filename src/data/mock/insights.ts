import type {
  DashboardInsight,
  FutureAgent,
  InsightTrendPoint,
} from "@/types/insights";

export const mockInsights: DashboardInsight[] = [
  {
    id: "insight-spending",
    domain: "finance",
    title: "Variable spending is running higher",
    summary:
      "Dining and transport are the main sources of this month’s increase.",
    evidence:
      "£842 across those categories versus £618 at the same point in June.",
    sentiment: "attention",
    metric: "+12%",
    comparison: "month over month",
    generatedAt: "2026-07-12T06:00:00+05:30",
  },
  {
    id: "insight-study",
    domain: "learning",
    title: "Weekday study rhythm is your strongest",
    summary:
      "Short morning sessions are producing the most consistent completion rate.",
    evidence:
      "86% of planned weekday sessions completed, compared with 58% on weekends.",
    sentiment: "positive",
    metric: "86%",
    comparison: "weekday consistency",
    generatedAt: "2026-07-12T06:00:00+05:30",
  },
  {
    id: "insight-weight",
    domain: "health",
    title: "Weight trend continues toward target",
    summary:
      "The four-week direction is steady without a sharp week-to-week change.",
    evidence:
      "Seven-day average moved from 83.2 kg to 82.6 kg over four weeks.",
    sentiment: "positive",
    metric: "−0.6 kg",
    comparison: "four-week average",
    generatedAt: "2026-07-12T06:00:00+05:30",
  },
  {
    id: "insight-followups",
    domain: "career",
    title: "Three applications need follow-up",
    summary:
      "Two recruiter conversations and one submitted application are past the preferred follow-up window.",
    evidence:
      "Capital One, Vanguard, and CoreWeave have had no activity for seven or more days.",
    sentiment: "attention",
    metric: "3",
    comparison: "follow-ups due",
    generatedAt: "2026-07-12T06:00:00+05:30",
  },
  {
    id: "insight-projects",
    domain: "projects",
    title: "Active project load is diluting momentum",
    summary:
      "Completion velocity falls when more than four projects remain active at once.",
    evidence:
      "Weekly completed tasks average 11 with three active projects and 7 with five.",
    sentiment: "neutral",
    metric: "−36%",
    comparison: "task velocity",
    generatedAt: "2026-07-12T06:00:00+05:30",
  },
];

export const mockInsightTrend: InsightTrendPoint[] = [
  { label: "Feb", consistency: 61, balance: 58 },
  { label: "Mar", consistency: 66, balance: 62 },
  { label: "Apr", consistency: 63, balance: 67 },
  { label: "May", consistency: 72, balance: 69 },
  { label: "Jun", consistency: 76, balance: 73 },
  { label: "Jul", consistency: 81, balance: 76 },
];

export const futureAgents: FutureAgent[] = [
  {
    id: "chief",
    name: "Uthai Chief-of-Staff Agent",
    description: "Coordinate priorities and surface cross-domain tradeoffs.",
    domain: "overview",
    status: "coming-later",
  },
  {
    id: "finance",
    name: "Finance Agent",
    description:
      "Monitor budgets, bills, and debt goals with permissioned actions.",
    domain: "finance",
    status: "coming-later",
  },
  {
    id: "health",
    name: "Health Agent",
    description: "Summarize routines and support sustainable habit reflection.",
    domain: "health",
    status: "coming-later",
  },
  {
    id: "career",
    name: "Career Agent",
    description: "Prepare follow-ups and keep applications moving.",
    domain: "career",
    status: "coming-later",
  },
  {
    id: "learning",
    name: "Learning Agent",
    description: "Shape revision queues around confidence and recall.",
    domain: "learning",
    status: "coming-later",
  },
  {
    id: "projects",
    name: "Project Agent",
    description: "Identify blockers and propose focused weekly plans.",
    domain: "projects",
    status: "coming-later",
  },
];
