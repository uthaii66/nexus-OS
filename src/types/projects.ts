export type ProjectStatus = "planning" | "active" | "on-hold" | "completed";

export type ProjectPriority = "low" | "medium" | "high" | "critical";

export type ProjectTaskStatus =
  | "backlog"
  | "todo"
  | "in-progress"
  | "blocked"
  | "done";

export interface ProjectMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  color: string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: ProjectTaskStatus;
  priority: ProjectPriority;
  assigneeId?: string;
  dueDate: string;
  estimateHours: number;
  tags: string[];
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface ProjectActivity {
  id: string;
  projectId: string;
  type: "task" | "milestone" | "status" | "note" | "decision";
  message: string;
  actor: string;
  occurredAt: string;
}

export interface ProjectNote {
  id: string;
  projectId: string;
  kind: "note" | "decision";
  title: string;
  content: string;
  createdAt: string;
  author: string;
}

export interface Project {
  id: string;
  name: string;
  summary: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  deadline: string;
  repositoryUrl?: string;
  accent: string;
  memberIds: string[];
  tags: string[];
  blockerCount: number;
  updatedAt: string;
}

export interface CreateProjectTaskInput {
  projectId: string;
  title: string;
  description?: string;
  status: ProjectTaskStatus;
  priority: ProjectPriority;
  dueDate: string;
  estimateHours?: number;
  assigneeId?: string;
}

export interface CreateProjectNoteInput {
  projectId: string;
  kind: "note" | "decision";
  title: string;
  content: string;
}

export interface ProjectDetail {
  project: Project;
  tasks: ProjectTask[];
  milestones: ProjectMilestone[];
  activity: ProjectActivity[];
  notes: ProjectNote[];
  members: ProjectMember[];
}
