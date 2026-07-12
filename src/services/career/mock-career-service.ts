import { mockCareerDashboard } from "@/data/mock/career"
import type {
  ApplicationNote,
  ApplicationStage,
  CareerDashboard,
  CreateApplicationInput,
  JobApplication,
  UpdateApplicationInput,
} from "@/types/career"

import type { CareerService } from "./career-service"

export class MockCareerService implements CareerService {
  private dashboard: CareerDashboard = structuredClone(mockCareerDashboard)

  async getDashboard(): Promise<CareerDashboard> {
    return structuredClone(this.dashboard)
  }

  async createApplication(
    input: CreateApplicationInput,
  ): Promise<JobApplication> {
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

    this.dashboard.applications = [application, ...this.dashboard.applications]
    return structuredClone(application)
  }

  async updateApplication(
    id: string,
    input: UpdateApplicationInput,
  ): Promise<JobApplication> {
    const application = this.findApplication(id)
    Object.assign(application, input, { updatedAt: new Date().toISOString() })
    return structuredClone(application)
  }

  async updateStage(
    id: string,
    stage: ApplicationStage,
  ): Promise<JobApplication> {
    return this.updateApplication(id, { stage })
  }

  async addNote(applicationId: string, body: string): Promise<ApplicationNote> {
    const application = this.findApplication(applicationId)
    const note: ApplicationNote = {
      id: `note-${crypto.randomUUID()}`,
      body,
      createdAt: new Date().toISOString(),
    }

    application.notes = [note, ...application.notes]
    application.updatedAt = note.createdAt
    return structuredClone(note)
  }

  async deleteApplication(id: string): Promise<void> {
    this.dashboard.applications = this.dashboard.applications.filter(
      (application) => application.id !== id,
    )
  }

  private findApplication(id: string): JobApplication {
    const application = this.dashboard.applications.find(
      (candidate) => candidate.id === id,
    )

    if (!application) {
      throw new Error("Application not found")
    }

    return application
  }
}

export const careerService: CareerService = new MockCareerService()
