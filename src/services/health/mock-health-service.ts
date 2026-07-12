import {
  dailyHabits,
  habitConsistency,
  healthLogs,
  healthSummary,
  nutritionTrend,
  progressPhotos,
  weightTrend,
} from "@/data/mock/health";
import type { HealthService } from "@/services/health/health-service";
import type { CreateHealthLogInput, HealthLog } from "@/types/health";

const clone = <T>(value: T): T => structuredClone(value);

const createLogId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? `health-${crypto.randomUUID()}`
    : `health-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export class MockHealthService implements HealthService {
  private logs = clone(healthLogs);

  async getSummary() {
    return clone(healthSummary);
  }

  async getLogs() {
    return clone(this.logs);
  }

  async createLog(input: CreateHealthLogInput) {
    const log = {
      ...input,
      id: createLogId(),
      createdAt: new Date().toISOString(),
    } as HealthLog;
    this.logs = [log, ...this.logs];
    return clone(log);
  }

  async deleteLog(id: string) {
    this.logs = this.logs.filter((log) => log.id !== id);
  }

  async getWeightTrend() {
    return clone(weightTrend);
  }

  async getNutritionTrend() {
    return clone(nutritionTrend);
  }

  async getDailyHabits() {
    return clone(dailyHabits);
  }

  async getHabitConsistency() {
    return clone(habitConsistency);
  }

  async getProgressPhotos() {
    return clone(progressPhotos);
  }
}

export const healthService: HealthService = new MockHealthService();
