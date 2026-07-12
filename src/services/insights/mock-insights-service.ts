import {
  futureAgents,
  mockInsights,
  mockInsightTrend,
} from "@/data/mock/insights"
import type { InsightsService } from "@/services/insights/insights-service"

export class MockInsightsService implements InsightsService {
  private insights = structuredClone(mockInsights)

  async getInsights() {
    return structuredClone(this.insights)
  }

  async getTrend() {
    return structuredClone(mockInsightTrend)
  }

  async getFutureAgents() {
    return structuredClone(futureAgents)
  }

  async dismissInsight(insightId: string) {
    this.insights = this.insights.filter((insight) => insight.id !== insightId)
  }
}

export const insightsService: InsightsService = new MockInsightsService()
