export const APPLICATION_STAGES = [
  "Discovered",
  "Reviewing",
  "Resume tailored",
  "Referral requested",
  "Applied",
  "Recruiter screen",
  "Technical interview",
  "Final interview",
  "Offer",
  "Rejected",
] as const

export type ApplicationStage = (typeof APPLICATION_STAGES)[number]
export type JobPriority = "standard" | "high"
export type WorkMode = "Remote" | "Hybrid" | "On-site"
export type InterviewType =
  | "Recruiter screen"
  | "Technical"
  | "System design"
  | "Behavioral"
  | "Final"

export interface ApplicationNote {
  id: string
  body: string
  createdAt: string
}

export interface JobApplication {
  id: string
  company: string
  role: string
  location: string
  workMode: WorkMode
  stage: ApplicationStage
  priority: JobPriority
  discoveredAt: string
  appliedAt?: string
  followUpDate?: string
  resumeVersionId?: string
  source: string
  salaryRange?: string
  notes: ApplicationNote[]
  updatedAt: string
}

export interface CareerInterview {
  id: string
  applicationId: string
  company: string
  role: string
  type: InterviewType
  scheduledAt: string
  durationMinutes: number
  interviewer?: string
  meetingType: "Video" | "Phone" | "On-site"
}

export interface RecruiterContact {
  id: string
  name: string
  company: string
  role: string
  email: string
  lastContactedAt: string
  relationship: "New" | "Active" | "Warm"
}

export interface ResumeVersion {
  id: string
  name: string
  focus: string
  updatedAt: string
  applicationsCount: number
}

export interface CareerActivity {
  id: string
  type: "application" | "stage" | "note" | "interview" | "resume"
  description: string
  occurredAt: string
}

export interface CareerDashboard {
  applications: JobApplication[]
  interviews: CareerInterview[]
  contacts: RecruiterContact[]
  resumeVersions: ResumeVersion[]
  recentActivity: CareerActivity[]
}

export interface CreateApplicationInput {
  company: string
  role: string
  location: string
  workMode: WorkMode
  stage: ApplicationStage
  priority: JobPriority
  discoveredAt: string
  appliedAt?: string
  followUpDate?: string
  resumeVersionId?: string
  source: string
  salaryRange?: string
  initialNote?: string
}

export type UpdateApplicationInput = Partial<
  Omit<JobApplication, "id" | "notes" | "updatedAt">
>
