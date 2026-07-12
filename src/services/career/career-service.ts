import type {
  ApplicationNote,
  ApplicationStage,
  CareerDashboard,
  CreateApplicationInput,
  JobApplication,
  UpdateApplicationInput,
} from "@/types/career"

export interface CareerService {
  getDashboard(): Promise<CareerDashboard>
  createApplication(input: CreateApplicationInput): Promise<JobApplication>
  updateApplication(
    id: string,
    input: UpdateApplicationInput,
  ): Promise<JobApplication>
  updateStage(id: string, stage: ApplicationStage): Promise<JobApplication>
  addNote(applicationId: string, body: string): Promise<ApplicationNote>
  deleteApplication(id: string): Promise<void>
}
