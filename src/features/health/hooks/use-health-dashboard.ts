import { useEffect, useState } from "react";

import { healthService } from "@/services/health";
import type {
  DailyHabitPoint,
  HabitConsistency,
  NutritionTrendPoint,
  ProgressPhoto,
  WeightTrendPoint,
} from "@/types/health";

interface HealthDashboardReferenceData {
  weightTrend: WeightTrendPoint[];
  nutritionTrend: NutritionTrendPoint[];
  dailyHabits: DailyHabitPoint[];
  habitConsistency: HabitConsistency[];
  progressPhotos: ProgressPhoto[];
}

export function useHealthDashboard() {
  const [data, setData] = useState<HealthDashboardReferenceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    try {
      const [weights, nutrition, habits, consistency, photos] =
        await Promise.all([
          healthService.getWeightTrend(),
          healthService.getNutritionTrend(),
          healthService.getDailyHabits(),
          healthService.getHabitConsistency(),
          healthService.getProgressPhotos(),
        ]);
      setData({
        weightTrend: weights,
        nutritionTrend: nutrition,
        dailyHabits: habits,
        habitConsistency: consistency,
        progressPhotos: photos,
      });
    } catch {
      setError("Health data could not be loaded.");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return { data, error, reload: load };
}
