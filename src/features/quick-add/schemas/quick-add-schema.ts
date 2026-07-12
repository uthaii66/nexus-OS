import { z } from "zod"

const requiredAmountActions = ["expense", "income"]
const requiredValueActions = ["weight"]
const durationActions = ["workout", "study-session"]

export const quickAddSchema = z.object({
  action: z.enum(["expense", "income", "weight", "meal", "workout", "study-session", "job-application", "application-update", "project-task", "calendar-event", "note"]),
  title: z.string().trim().max(100, "Keep the title under 100 characters").optional(),
  amount: z.coerce.number().positive("Enter an amount greater than zero").max(1_000_000).optional(),
  value: z.coerce.number().positive("Enter a value greater than zero").max(1000).optional(),
  calories: z.coerce.number().min(0).max(10000).optional(),
  protein: z.coerce.number().min(0).max(1000).optional(),
  duration: z.coerce.number().positive("Enter a duration greater than zero").max(1440).optional(),
  date: z.string().min(1, "Choose a date"),
  time: z.string().optional(),
  category: z.string().trim().max(50).optional(),
  company: z.string().trim().max(100).optional(),
  role: z.string().trim().max(100).optional(),
  stage: z.string().optional(),
  project: z.string().optional(),
  notes: z.string().trim().max(1000, "Keep notes under 1,000 characters").optional(),
  recurring: z.boolean().default(false),
}).superRefine((values, context) => {
  if (requiredAmountActions.includes(values.action) && !values.amount) context.addIssue({ code: "custom", path: ["amount"], message: "Amount is required" })
  if (requiredValueActions.includes(values.action) && !values.value) context.addIssue({ code: "custom", path: ["value"], message: "Weight is required" })
  if (durationActions.includes(values.action) && !values.duration) context.addIssue({ code: "custom", path: ["duration"], message: "Duration is required" })
  if (["meal", "workout", "study-session", "project-task", "calendar-event", "note"].includes(values.action) && !values.title) context.addIssue({ code: "custom", path: ["title"], message: "A title is required" })
  if (["job-application", "application-update"].includes(values.action) && !values.company) context.addIssue({ code: "custom", path: ["company"], message: "Company is required" })
  if (values.action === "job-application" && !values.role) context.addIssue({ code: "custom", path: ["role"], message: "Role is required" })
})

export type QuickAddValues = z.infer<typeof quickAddSchema>
