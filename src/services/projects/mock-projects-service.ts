import {
  mockProjectActivity,
  mockProjectMilestones,
  mockProjectNotes,
  mockProjects,
  mockProjectTasks,
  projectMembers,
} from "@/data/mock/projects"
import type { ProjectsService } from "@/services/projects/projects-service"
import type {
  CreateProjectNoteInput,
  CreateProjectTaskInput,
  ProjectNote,
  ProjectTask,
  ProjectTaskStatus,
} from "@/types/projects"

const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export class MockProjectsService implements ProjectsService {
  private projects = structuredClone(mockProjects)
  private tasks = structuredClone(mockProjectTasks)
  private notes = structuredClone(mockProjectNotes)

  async getProjects() {
    return structuredClone(this.projects)
  }

  async getProjectDetail(projectId: string) {
    const project = this.projects.find((item) => item.id === projectId)
    if (!project) return null

    return {
      project: structuredClone(project),
      tasks: structuredClone(
        this.tasks.filter((item) => item.projectId === projectId),
      ),
      milestones: structuredClone(
        mockProjectMilestones.filter((item) => item.projectId === projectId),
      ),
      activity: structuredClone(
        mockProjectActivity.filter((item) => item.projectId === projectId),
      ),
      notes: structuredClone(
        this.notes.filter((item) => item.projectId === projectId),
      ),
      members: structuredClone(
        projectMembers.filter((item) => project.memberIds.includes(item.id)),
      ),
    }
  }

  async createTask(input: CreateProjectTaskInput): Promise<ProjectTask> {
    const task: ProjectTask = {
      id: createId("task"),
      projectId: input.projectId,
      title: input.title,
      description: input.description ?? "",
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate,
      estimateHours: input.estimateHours ?? 1,
      assigneeId: input.assigneeId,
      tags: [],
    }
    this.tasks.unshift(task)
    return structuredClone(task)
  }

  async updateTaskStatus(taskId: string, status: ProjectTaskStatus) {
    const task = this.tasks.find((item) => item.id === taskId)
    if (!task) throw new Error(`Task ${taskId} was not found.`)
    task.status = status
    return structuredClone(task)
  }

  async createNote(input: CreateProjectNoteInput): Promise<ProjectNote> {
    const note: ProjectNote = {
      id: createId("note"),
      ...input,
      createdAt: new Date().toISOString(),
      author: "Uthai",
    }
    this.notes.unshift(note)
    return structuredClone(note)
  }
}

export const projectsService: ProjectsService = new MockProjectsService()
