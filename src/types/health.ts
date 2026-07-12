export const healthLogTypes = [
  "daily-check-in",
  "weight",
  "meal",
  "workout",
  "steps",
  "sleep",
  "water",
  "mood",
] as const

export type HealthLogType = (typeof healthLogTypes)[number]
export type MoodLevel = 1 | 2 | 3 | 4 | 5
export type WorkoutIntensity = "low" | "moderate" | "high"
export type HabitStatus = "done" | "missed" | "not-applicable"

interface BaseHealthLog {
  id: string
  date: string
  createdAt: string
  note?: string
}

export interface DailyCheckInLog extends BaseHealthLog {
  type: "daily-check-in"
  calories?: number
  proteinGrams?: number
  steps?: number
  sleepHours?: number
  waterLiters?: number
  workoutStatus: HabitStatus
  dietStatus: HabitStatus
  supplementsStatus: HabitStatus
  skincareStatus: HabitStatus
  smokingStatus: HabitStatus
  dsaStatus: HabitStatus
  skillImprovementStatus: HabitStatus
  focus: MoodLevel
  mood: MoodLevel
  energy: MoodLevel
}

export interface WeightLog extends BaseHealthLog {
  type: "weight"
  weightKg: number
}

export interface MealLog extends BaseHealthLog {
  type: "meal"
  mealName: string
  calories: number
  proteinGrams: number
}

export interface WorkoutLog extends BaseHealthLog {
  type: "workout"
  workoutName: string
  durationMinutes: number
  intensity: WorkoutIntensity
  caloriesBurned?: number
}

export interface StepsLog extends BaseHealthLog {
  type: "steps"
  steps: number
}

export interface SleepLog extends BaseHealthLog {
  type: "sleep"
  hours: number
  quality: MoodLevel
}

export interface WaterLog extends BaseHealthLog {
  type: "water"
  liters: number
}

export interface MoodLog extends BaseHealthLog {
  type: "mood"
  mood: MoodLevel
  energy: MoodLevel
}

export type HealthLog =
  | DailyCheckInLog
  | WeightLog
  | MealLog
  | WorkoutLog
  | StepsLog
  | SleepLog
  | WaterLog
  | MoodLog

export type CreateHealthLogInput = HealthLog extends infer T
  ? T extends HealthLog
    ? Omit<T, "id" | "createdAt">
    : never
  : never

export interface HealthSummary {
  currentWeightKg: number
  startingWeightKg: number
  targetWeightKg: number
  weeklyWeightAverageKg: number
  dailyCalorieAverage: number
  calorieTarget: number
  dailyProteinAverageGrams: number
  proteinTargetGrams: number
  workoutStreakDays: number
  todaySteps: number
  stepsTarget: number
  lastSleepHours: number
  todayWaterLiters: number
  waterTargetLiters: number
  bodyFatPercent: number | null
}

export interface WeightTrendPoint {
  date: string
  weightKg: number
  movingAverageKg: number
}

export interface NutritionTrendPoint {
  date: string
  calories: number
  calorieTarget: number
  proteinGrams: number
}

export interface DailyHabitPoint {
  date: string
  steps: number
  sleepHours: number
  waterLiters: number
  workoutComplete: boolean
  proteinTargetMet: boolean
}

export interface HabitConsistency {
  id: string
  name: string
  completedDays: number
  targetDays: number
  unit: string
  accent: "blue" | "green" | "amber" | "violet"
}

export interface ProgressPhoto {
  id: string
  date: string
  label: string
}

export interface HealthDashboardData {
  summary: HealthSummary
  logs: HealthLog[]
  weightTrend: WeightTrendPoint[]
  nutritionTrend: NutritionTrendPoint[]
  dailyHabits: DailyHabitPoint[]
  habitConsistency: HabitConsistency[]
  progressPhotos: ProgressPhoto[]
}
