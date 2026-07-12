import { mockLearningDashboard } from "@/data/mock/learning";
import type {
  CreateStudySessionInput,
  DsaProblem,
  LearningDashboard,
  StudySession,
  UpdateDsaProblemInput,
} from "@/types/learning";

import type { LearningService } from "./learning-service";

export class MockLearningService implements LearningService {
  private dashboard: LearningDashboard = structuredClone(mockLearningDashboard);

  async getDashboard(): Promise<LearningDashboard> {
    return structuredClone(this.dashboard);
  }

  async createStudySession(
    input: CreateStudySessionInput,
  ): Promise<StudySession> {
    const session: StudySession = {
      ...input,
      id: `session-${crypto.randomUUID()}`,
    };

    this.dashboard.sessions = [session, ...this.dashboard.sessions];
    return structuredClone(session);
  }

  async updateProblem(
    id: string,
    input: UpdateDsaProblemInput,
  ): Promise<DsaProblem> {
    const problem = this.dashboard.problems.find(
      (candidate) => candidate.id === id,
    );

    if (!problem) {
      throw new Error("Problem not found");
    }

    Object.assign(problem, input);
    return structuredClone(problem);
  }
}

export const learningService: LearningService = new MockLearningService();
