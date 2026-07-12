import { create } from "zustand";

import { healthLogs, healthSummary } from "@/data/mock/health";
import type {
  CreateHealthLogInput,
  DailyCheckInLog,
  HealthLog,
  HealthSummary,
  MealLog,
  MoodLog,
  SleepLog,
  StepsLog,
  WaterLog,
  WeightLog,
  WorkoutLog,
} from "@/types/health";

type LogDailyCheckInInput = Omit<DailyCheckInLog, "id" | "createdAt" | "type">;
type LogWeightInput = Omit<WeightLog, "id" | "createdAt" | "type">;
type LogMealInput = Omit<MealLog, "id" | "createdAt" | "type">;
type LogWorkoutInput = Omit<WorkoutLog, "id" | "createdAt" | "type">;
type LogStepsInput = Omit<StepsLog, "id" | "createdAt" | "type">;
type LogSleepInput = Omit<SleepLog, "id" | "createdAt" | "type">;
type LogWaterInput = Omit<WaterLog, "id" | "createdAt" | "type">;
type LogMoodInput = Omit<MoodLog, "id" | "createdAt" | "type">;

interface HealthState {
  logs: HealthLog[];
  addHealthLog: (input: CreateHealthLogInput) => HealthLog;
  logDailyCheckIn: (input: LogDailyCheckInInput) => HealthLog;
  logWeight: (input: LogWeightInput) => HealthLog;
  logMeal: (input: LogMealInput) => HealthLog;
  logWorkout: (input: LogWorkoutInput) => HealthLog;
  logSteps: (input: LogStepsInput) => HealthLog;
  logSleep: (input: LogSleepInput) => HealthLog;
  logWater: (input: LogWaterInput) => HealthLog;
  logMood: (input: LogMoodInput) => HealthLog;
  deleteHealthLog: (id: string) => void;
  resetHealthSession: () => void;
}

const createLogId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? `health-${crypto.randomUUID()}`
    : `health-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const initialLogs = () => healthLogs.map((log) => ({ ...log }));

export const useHealthStore = create<HealthState>((set, get) => {
  const addHealthLog = (input: CreateHealthLogInput): HealthLog => {
    const log = {
      ...input,
      id: createLogId(),
      createdAt: new Date().toISOString(),
    } as HealthLog;
    set((state) => ({ logs: [log, ...state.logs] }));
    return log;
  };

  return {
    logs: initialLogs(),
    addHealthLog,
    logDailyCheckIn: (input) =>
      get().addHealthLog({ ...input, type: "daily-check-in" }),
    logWeight: (input) => get().addHealthLog({ ...input, type: "weight" }),
    logMeal: (input) => get().addHealthLog({ ...input, type: "meal" }),
    logWorkout: (input) => get().addHealthLog({ ...input, type: "workout" }),
    logSteps: (input) => get().addHealthLog({ ...input, type: "steps" }),
    logSleep: (input) => get().addHealthLog({ ...input, type: "sleep" }),
    logWater: (input) => get().addHealthLog({ ...input, type: "water" }),
    logMood: (input) => get().addHealthLog({ ...input, type: "mood" }),
    deleteHealthLog: (id) =>
      set((state) => ({ logs: state.logs.filter((log) => log.id !== id) })),
    resetHealthSession: () => set({ logs: initialLogs() }),
  };
});

export const calculateHealthSummary = (logs: HealthLog[]): HealthSummary => {
  const sortedWeights = logs
    .filter((log): log is WeightLog => log.type === "weight")
    .sort((left, right) => right.date.localeCompare(left.date));
  const latestWeight =
    sortedWeights[0]?.weightKg ?? healthSummary.currentWeightKg;
  const weekWeights = sortedWeights.slice(0, 7);
  const weeklyWeightAverageKg =
    weekWeights.length > 0
      ? weekWeights.reduce((total, log) => total + log.weightKg, 0) /
        weekWeights.length
      : healthSummary.weeklyWeightAverageKg;
  const todayLogs = logs.filter((log) => log.date === "2026-07-12");
  const meals = todayLogs.filter((log): log is MealLog => log.type === "meal");
  const initialMeals = healthLogs.filter(
    (log): log is MealLog => log.type === "meal" && log.date === "2026-07-12",
  );
  const mealDeltaCalories =
    meals.reduce((total, log) => total + log.calories, 0) -
    initialMeals.reduce((total, log) => total + log.calories, 0);
  const mealDeltaProtein =
    meals.reduce((total, log) => total + log.proteinGrams, 0) -
    initialMeals.reduce((total, log) => total + log.proteinGrams, 0);
  const steps = todayLogs.find((log): log is StepsLog => log.type === "steps");
  const water = todayLogs.find((log): log is WaterLog => log.type === "water");
  const latestSleep = logs.find((log): log is SleepLog => log.type === "sleep");

  return {
    ...healthSummary,
    currentWeightKg: latestWeight,
    weeklyWeightAverageKg,
    todaySteps: steps?.steps ?? healthSummary.todaySteps,
    todayWaterLiters: water?.liters ?? healthSummary.todayWaterLiters,
    lastSleepHours: latestSleep?.hours ?? healthSummary.lastSleepHours,
    dailyCalorieAverage:
      healthSummary.dailyCalorieAverage + mealDeltaCalories / 7,
    dailyProteinAverageGrams:
      healthSummary.dailyProteinAverageGrams + mealDeltaProtein / 7,
  };
};

export type { HealthState };
