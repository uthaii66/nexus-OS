import { z } from "zod";

import { APPLICATION_STAGES } from "@/types/career";

export const applicationFormSchema = z.object({
  company: z.string().trim().min(2, "Enter a company name").max(60),
  role: z.string().trim().min(3, "Enter the role title").max(100),
  location: z.string().trim().min(2, "Enter a location").max(80),
  workMode: z.enum(["Remote", "Hybrid", "On-site"]),
  stage: z.enum(APPLICATION_STAGES),
  isPriority: z.boolean(),
  discoveredAt: z.string().min(1, "Choose a discovery date"),
  appliedAt: z.string().optional(),
  followUpDate: z.string().optional(),
  resumeVersionId: z.string().optional(),
  source: z.string().trim().min(2, "Enter where you found the role").max(60),
  salaryRange: z.string().trim().max(50).optional(),
  initialNote: z.string().trim().max(500).optional(),
});

export const applicationNoteSchema = z.object({
  body: z.string().trim().min(2, "Write a short note").max(500),
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;
export type ApplicationNoteFormValues = z.infer<typeof applicationNoteSchema>;
