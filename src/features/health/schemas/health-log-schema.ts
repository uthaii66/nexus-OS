import { z } from "zod"

import { healthLogTypes } from "@/types/health"

export const healthLogSchema = z
  .object({
    type: z.enum(healthLogTypes),
    date: z.string().min(1, "Choose a date"),
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
