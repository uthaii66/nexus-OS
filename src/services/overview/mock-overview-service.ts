import {
  overviewAlerts,
  overviewLifeScore,
  overviewMetrics,
  overviewPriorities,
  overviewRecentActivity,
  overviewSchedule,
  overviewWeeklyProgress,
} from "@/data/mock/overview";
import type { OverviewService } from "@/services/overview/overview-service";

export const mockOverviewService: OverviewService = {
  async getSnapshot() {
    return {
      priorities: structuredClone(overviewPriorities),
      lifeScore: structuredClone(overviewLifeScore),
      metrics: structuredClone(overviewMetrics),
      schedule: structuredClone(overviewSchedule),
      alerts: structuredClone(overviewAlerts),
      weeklyProgress: structuredClone(overviewWeeklyProgress),
      recentActivity: structuredClone(overviewRecentActivity),
    };
  },
};
