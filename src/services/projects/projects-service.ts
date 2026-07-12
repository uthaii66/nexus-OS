import type {
  CreateProjectNoteInput,
  CreateProjectTaskInput,
  Project,
  ProjectDetail,
  ProjectNote,
  ProjectTask,
  ProjectTaskStatus,
} from "@/types/projects";

export interface ProjectsService {
  getProjects(): Promise<Project[]>;
  getProjectDetail(projectId: string): Promise<ProjectDetail | null>;
  createTask(input: CreateProjectTaskInput): Promise<ProjectTask>;
  updateTaskStatus(
    taskId: string,
    status: ProjectTaskStatus,
  ): Promise<ProjectTask>;
  createNote(input: CreateProjectNoteInput): Promise<ProjectNote>;
}
