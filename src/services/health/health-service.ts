import type {
  CreateHealthLogInput,
  DailyHabitPoint,
  HabitConsistency,
  HealthLog,
  HealthSummary,
  NutritionTrendPoint,
  ProgressPhoto,
  WeightTrendPoint,
} from "@/types/health";

export interface HealthService {
  getSummary(): Promise<HealthSummary>;
  getLogs(): Promise<HealthLog[]>;
  createLog(input: CreateHealthLogInput): Promise<HealthLog>;
  deleteLog(id: string): Promise<void>;
  getWeightTrend(): Promise<WeightTrendPoint[]>;
  getNutritionTrend(): Promise<NutritionTrendPoint[]>;
  getDailyHabits(): Promise<DailyHabitPoint[]>;
  getHabitConsistency(): Promise<HabitConsistency[]>;
  getProgressPhotos(): Promise<ProgressPhoto[]>;
}
