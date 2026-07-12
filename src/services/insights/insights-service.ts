import type {
  DashboardInsight,
  FutureAgent,
  InsightTrendPoint,
} from "@/types/insights";

export interface InsightsService {
  getInsights(): Promise<DashboardInsight[]>;
  getTrend(): Promise<InsightTrendPoint[]>;
  getFutureAgents(): Promise<FutureAgent[]>;
  dismissInsight(insightId: string): Promise<void>;
}
