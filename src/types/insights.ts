export type InsightDomain =
  | "finance"
  | "health"
  | "learning"
  | "career"
  | "projects";

export type InsightSentiment = "positive" | "neutral" | "attention";

export interface DashboardInsight {
  id: string;
  domain: InsightDomain;
  title: string;
  summary: string;
  evidence: string;
  sentiment: InsightSentiment;
  metric: string;
  comparison: string;
  generatedAt: string;
}

export interface InsightTrendPoint {
  label: string;
  consistency: number;
  balance: number;
}

export interface FutureAgent {
  id: string;
  name: string;
  description: string;
  domain: InsightDomain | "overview";
  status: "coming-later";
}
