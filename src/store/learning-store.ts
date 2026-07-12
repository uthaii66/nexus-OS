import { create } from "zustand";

import { mockLearningDashboard } from "@/data/mock/learning";
import type {
  CreateStudySessionInput,
  DsaProblem,
  LearningDashboard,
  StudyPlanItem,
  StudySession,
  UpdateDsaProblemInput,
} from "@/types/learning";

interface LearningState extends LearningDashboard {
  addStudySession: (input: CreateStudySessionInput) => StudySession;
  updateProblem: (id: string, input: UpdateDsaProblemInput) => void;
  setStudyPlanStatus: (id: string, status: StudyPlanItem["status"]) => void;
  resetLearning: () => void;
}

const initialLearningState = (): LearningDashboard =>
  structuredClone(mockLearningDashboard);

export const useLearningStore = create<LearningState>((set) => ({
  ...initialLearningState(),
  addStudySession: (input) => {
    const session: StudySession = {
      ...input,
      id: `session-${crypto.randomUUID()}`,
    };

    set((state) => {
      const day = input.studiedAt.slice(0, 10);
      const matchingPoint = state.activity.find((point) => point.date === day);
      const activity = matchingPoint
        ? state.activity.map((point) =>
            point.date === day
              ? { ...point, minutes: point.minutes + input.durationMinutes }
              : point,
          )
        : state.activity;

      return { sessions: [session, ...state.sessions], activity };
    });

    return session;
  },
  updateProblem: (id, input) => {
    set((state) => ({
      problems: state.problems.map(
        (problem): DsaProblem =>
          problem.id === id ? { ...problem, ...input } : problem,
      ),
    }));
  },
  setStudyPlanStatus: (id, status) => {
    set((state) => ({
      studyPlan: state.studyPlan.map((item) =>
        item.id === id ? { ...item, status } : item,
      ),
    }));
  },
  resetLearning: () => set(initialLearningState()),
}));

export type { LearningState };
