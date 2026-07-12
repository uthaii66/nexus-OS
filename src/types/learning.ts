export const LEARNING_CATEGORIES = [
  "Python",
  "Data Structures and Algorithms",
  "React",
  "AI and Machine Learning",
  "Cloud and AWS",
  "System Design",
] as const;

export type LearningCategory = (typeof LEARNING_CATEGORIES)[number];

export type ProblemDifficulty = "Easy" | "Medium" | "Hard";
export type ProblemStatus = "Not started" | "Attempted" | "Solved" | "Revising";
export type StudyPlanStatus = "upcoming" | "in-progress" | "completed";

export interface StudyPlanItem {
  id: string;
  title: string;
  category: LearningCategory;
  durationMinutes: number;
  scheduledAt: string;
  status: StudyPlanStatus;
}

export interface LearningTopic {
  id: string;
  name: string;
  category: LearningCategory;
  progress: number;
  confidence: number;
  nextStep: string;
  updatedAt: string;
}

export interface DsaProblem {
  id: string;
  name: string;
  pattern: string;
  difficulty: ProblemDifficulty;
  status: ProblemStatus;
  attempts: number;
  solvedIndependently: boolean;
  confidence: number;
  revisionDate: string;
  lastAttemptedAt: string;
  platform: "LeetCode" | "NeetCode" | "HackerRank";
}

export interface StudySession {
  id: string;
  category: LearningCategory;
  topic: string;
  durationMinutes: number;
  studiedAt: string;
  focusScore: number;
  notes?: string;
}

export interface LearningActivityPoint {
  date: string;
  label: string;
  minutes: number;
  problems: number;
}

export interface LearningDashboard {
  currentStreak: number;
  longestStreak: number;
  weeklyGoalMinutes: number;
  problemsSolvedThisMonth: number;
  independentlySolvedThisMonth: number;
  studyPlan: StudyPlanItem[];
  topics: LearningTopic[];
  problems: DsaProblem[];
  sessions: StudySession[];
  activity: LearningActivityPoint[];
  weakTopics: string[];
}

export interface CreateStudySessionInput {
  category: LearningCategory;
  topic: string;
  durationMinutes: number;
  studiedAt: string;
  focusScore: number;
  notes?: string;
}

export type UpdateDsaProblemInput = Partial<
  Pick<
    DsaProblem,
    | "status"
    | "attempts"
    | "solvedIndependently"
    | "confidence"
    | "revisionDate"
    | "lastAttemptedAt"
  >
>;
