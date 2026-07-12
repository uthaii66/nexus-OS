import type {
  CreateStudySessionInput,
  DsaProblem,
  LearningDashboard,
  StudySession,
  UpdateDsaProblemInput,
} from "@/types/learning"

export interface LearningService {
  getDashboard(): Promise<LearningDashboard>
  createStudySession(input: CreateStudySessionInput): Promise<StudySession>
  updateProblem(id: string, input: UpdateDsaProblemInput): Promise<DsaProblem>
}
