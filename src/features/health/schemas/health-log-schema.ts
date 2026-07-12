import { z } from "zod"

import { healthLogTypes } from "@/types/health"

export const healthLogSchema = z
  .object({
    type: z.enum(healthLogTypes),
    date: z.string().min(1, "Choose a date"),
    workoutStatus: z.enum(["done", "missed", "not-applicable"]).optional(),
    dietStatus: z.enum(["done", "missed", "not-applicable"]).optional(),
    supplementsStatus: z.enum(["done", "missed", "not-applicable"]).optional(),
    skincareStatus: z.enum(["done", "missed", "not-applicable"]).optional(),
    smokingStatus: z.enum(["done", "missed", "not-applicable"]).optional(),
    dsaStatus: z.enum(["done", "missed", "not-applicable"]).optional(),
    skillImprovementStatus: z.enum(["done", "missed", "not-applicable"]).optional(),
    focus: z.number().int().min(1).max(5).optional(),
    note: z.string().trim().max(240).optional(),
    weightKg: z.number().positive().max(350).optional(),
    mealName: z.string().trim().max(80).optional(),
    calories: z.number().positive().max(10000).optional(),
    proteinGrams: z.number().nonnegative().max(500).optional(),
    workoutName: z.string().trim().max(80).optional(),
    durationMinutes: z.number().positive().max(600).optional(),
    intensity: z.enum(["low", "moderate", "high"]).optional(),
    caloriesBurned: z.number().nonnegative().max(5000).optional(),
    steps: z.number().int().positive().max(100000).optional(),
    hours: z.number().positive().max(24).optional(),
    quality: z.number().int().min(1).max(5).optional(),
    liters: z.number().positive().max(20).optional(),
    mood: z.number().int().min(1).max(5).optional(),
    energy: z.number().int().min(1).max(5).optional(),
  })
  .superRefine((values, context) => {
    const requireField = (field: keyof typeof values, message: string) => {
      if (values[field] === undefined || values[field] === "") {
        context.addIssue({ code: "custom", path: [field], message })
      }
    }

    if (values.type === "daily-check-in") {
      requireField("workoutStatus", "Choose workout status")
      requireField("dietStatus", "Choose diet status")
      requireField("supplementsStatus", "Choose supplements status")
      requireField("skincareStatus", "Choose skincare status")
      requireField("smokingStatus", "Choose smoking status")
      requireField("dsaStatus", "Choose DSA status")
      requireField("skillImprovementStatus", "Choose skill improvement status")
      requireField("focus", "Rate your focus")
      requireField("mood", "Rate your mood")
      requireField("energy", "Rate your energy")
    }

    if (values.type === "weight") requireField("weightKg", "Enter your weight")
    if (values.type === "meal") {
      requireField("mealName", "Enter the meal name")
      requireField("calories", "Enter calories")
      requireField("proteinGrams", "Enter protein")
    }
    if (values.type === "workout") {
      requireField("workoutName", "Enter the workout")
      requireField("durationMinutes", "Enter the duration")
      requireField("intensity", "Choose an intensity")
    }
    if (values.type === "steps") requireField("steps", "Enter your step count")
    if (values.type === "sleep") {
      requireField("hours", "Enter hours slept")
      requireField("quality", "Rate sleep quality")
    }
    if (values.type === "water") requireField("liters", "Enter water intake")
    if (values.type === "mood") {
      requireField("mood", "Rate your mood")
      requireField("energy", "Rate your energy")
    }
  })

export type HealthLogFormValues = z.infer<typeof healthLogSchema>
