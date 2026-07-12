import { z } from "zod"

import { LEARNING_CATEGORIES } from "@/types/learning"

export const studySessionSchema = z.object({
  category: z.enum(LEARNING_CATEGORIES),
  topic: z.string().trim().min(2, "Enter the topic you studied").max(80),
  durationMinutes: z.coerce
    .number()
    .int()
    .min(5, "Minimum session is 5 minutes")
    .max(480),
  studiedAt: z.string().min(1, "Choose a date and time"),
  focusScore: z.coerce.number().int().min(1).max(10),
  notes: z.string().trim().max(300).optional(),
})

export type StudySessionFormValues = z.infer<typeof studySessionSchema>
