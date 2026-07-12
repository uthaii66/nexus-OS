import { create } from "zustand"

import { mockCareerDashboard } from "@/data/mock/career"
import type {
  ApplicationNote,
  ApplicationStage,
  CareerActivity,
  CareerDashboard,
  CreateApplicationInput,
  JobApplication,
  ResumeVersion,
  UpdateApplicationInput,
} from "@/types/career"

interface CareerState extends CareerDashboard {
  addApplication: (input: CreateApplicationInput) => JobApplication
  updateApplication: (id: string, input: UpdateApplicationInput) => void
  deleteApplication: (id: string) => void
  moveApplication: (id: string, stage: ApplicationStage) => void
  addApplicationNote: (id: string, body: string) => ApplicationNote
  setFollowUpDate: (id: string, followUpDate?: string) => void
  togglePriority: (id: string) => void
  associateResume: (id: string, resumeVersionId?: ResumeVersion["id"]) => void
  resetCareer: () => void
}

const initialCareerState = (): CareerDashboard =>
  structuredClone(mockCareerDashboard)

const activity = (
  type: CareerActivity["type"],
  description: string,
): CareerActivity => ({
  id: `career-activity-${crypto.randomUUID()}`,
  type,
  description,
  occurredAt: new Date().toISOString(),
})

export const useCareerStore = create<CareerState>((set) => ({
  ...initialCareerState(),
  addApplication: (input) => {
    const { initialNote, ...applicationInput } = input
    const now = new Date().toISOString()
    const application: JobApplication = {
      ...applicationInput,
      id: `application-${crypto.randomUUID()}`,
      notes: initialNote
        ? [
            {
              id: `note-${crypto.randomUUID()}`,
              body: initialNote,
              createdAt: now,
            },
          ]
        : [],
      updatedAt: now,
    }

    set((state) => ({
      applications: [application, ...state.applications],
      recentActivity: [
        activity(
          "application",
          `Added ${application.company} · ${application.role}`,
        ),
        ...state.recentActivity,
      ].slice(0, 12),
    }))

    return application
  },
  updateApplication: (id, input) => {
    set((state) => {
      const application = state.applications.find(
        (candidate) => candidate.id === id,
      )
      if (!application) return state

      return {
        applications: state.applications.map((candidate) =>
          candidate.id === id
            ? { ...candidate, ...input, updatedAt: new Date().toISOString() }
            : candidate,
        ),
        recentActivity: [
          activity("stage", `Updated ${application.company} application`),
          ...state.recentActivity,
        ].slice(0, 12),
      }
    })
  },
  deleteApplication: (id) => {
    set((state) => ({
      applications: state.applications.filter(
        (application) => application.id !== id,
      ),
    }))
  },
  moveApplication: (id, stage) => {
    set((state) => {
      const application = state.applications.find(
        (candidate) => candidate.id === id,
      )
      if (!application || application.stage === stage) return state

      return {
        applications: state.applications.map((candidate) =>
          candidate.id === id
            ? { ...candidate, stage, updatedAt: new Date().toISOString() }
            : candidate,
        ),
        recentActivity: [
          activity("stage", `Moved ${application.company} to ${stage}`),
          ...state.recentActivity,
        ].slice(0, 12),
      }
    })
  },
  addApplicationNote: (id, body) => {
    const note: ApplicationNote = {
      id: `note-${crypto.randomUUID()}`,
      body,
      createdAt: new Date().toISOString(),
    }

    set((state) => {
      const application = state.applications.find(
        (candidate) => candidate.id === id,
      )
      if (!application) return state

      return {
        applications: state.applications.map((candidate) =>
          candidate.id === id
            ? {
                ...candidate,
                notes: [note, ...candidate.notes],
                updatedAt: note.createdAt,
              }
            : candidate,
        ),
        recentActivity: [
          activity("note", `Added a note to ${application.company}`),
          ...state.recentActivity,
        ].slice(0, 12),
      }
    })

    return note
  },
  setFollowUpDate: (id, followUpDate) => {
    set((state) => ({
      applications: state.applications.map((application) =>
        application.id === id
          ? {
              ...application,
              followUpDate,
              updatedAt: new Date().toISOString(),
            }
          : application,
      ),
    }))
  },
  togglePriority: (id) => {
    set((state) => ({
      applications: state.applications.map((application) =>
        application.id === id
          ? {
              ...application,
              priority: application.priority === "high" ? "standard" : "high",
              updatedAt: new Date().toISOString(),
            }
          : application,
      ),
    }))
  },
  associateResume: (id, resumeVersionId) => {
    set((state) => ({
      applications: state.applications.map((application) =>
        application.id === id
          ? {
              ...application,
              resumeVersionId,
              updatedAt: new Date().toISOString(),
            }
          : application,
      ),
    }))
  },
  resetCareer: () => set(initialCareerState()),
}))

export type { CareerState }
