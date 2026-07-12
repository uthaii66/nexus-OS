import { create } from "zustand"

import {
  mockProjectActivity,
  mockProjectMilestones,
  mockProjectNotes,
  mockProjects,
  mockProjectTasks,
  projectMembers,
} from "@/data/mock/projects"
import type {
  CreateProjectNoteInput,
  CreateProjectTaskInput,
  Project,
  ProjectActivity,
  ProjectMilestone,
  ProjectMember,
  ProjectNote,
  ProjectTask,
  ProjectTaskStatus,
} from "@/types/projects"

interface ProjectsState {
  projects: Project[]
  members: ProjectMember[]
  tasks: ProjectTask[]
  milestones: ProjectMilestone[]
  activity: ProjectActivity[]
  notes: ProjectNote[]
  addTask: (
    projectId: string,
    input: Omit<CreateProjectTaskInput, "projectId">,
  ) => void
  moveTask: (taskId: string, status: ProjectTaskStatus) => void
  toggleMilestone: (milestoneId: string) => void
  addNote: (input: CreateProjectNoteInput) => void
  resetProjects: () => void
}

const createSessionId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const initialState = () => ({
  projects: structuredClone(mockProjects),
  members: structuredClone(projectMembers),
  tasks: structuredClone(mockProjectTasks),
  milestones: structuredClone(mockProjectMilestones),
  activity: structuredClone(mockProjectActivity),
  notes: structuredClone(mockProjectNotes),
})

export const useProjectsStore = create<ProjectsState>((set) => ({
  ...initialState(),
  addTask: (projectId, input) =>
    set((state) => {
      const task: ProjectTask = {
        id: createSessionId("task"),
        projectId,
        title: input.title,
        description: input.description ?? "",
        status: input.status,
        priority: input.priority,
        dueDate: input.dueDate,
        estimateHours: input.estimateHours ?? 1,
        assigneeId: input.assigneeId,
        tags: [],
      }
      const activity: ProjectActivity = {
        id: createSessionId("activity"),
        projectId,
        type: "task",
        message: `Added task “${input.title}”`,
        actor: "Uthai",
        occurredAt: new Date().toISOString(),
      }
      return {
        tasks: [task, ...state.tasks],
        activity: [activity, ...state.activity],
      }
    }),
  moveTask: (taskId, status) =>
    set((state) => {
      const current = state.tasks.find((task) => task.id === taskId)
      if (!current || current.status === status) return state
      const activity: ProjectActivity = {
        id: createSessionId("activity"),
        projectId: current.projectId,
        type: "status",
        message: `Moved “${current.title}” to ${status.replace("-", " ")}`,
        actor: "Uthai",
        occurredAt: new Date().toISOString(),
      }
      return {
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, status } : task,
        ),
        activity: [activity, ...state.activity],
      }
    }),
  toggleMilestone: (milestoneId) =>
    set((state) => ({
      milestones: state.milestones.map((milestone) =>
        milestone.id === milestoneId
          ? { ...milestone, completed: !milestone.completed }
          : milestone,
      ),
    })),
  addNote: (input) =>
    set((state) => {
      const note: ProjectNote = {
        id: createSessionId("note"),
        ...input,
        createdAt: new Date().toISOString(),
        author: "Uthai",
      }
      const activity: ProjectActivity = {
        id: createSessionId("activity"),
        projectId: input.projectId,
        type: input.kind,
        message: `Added ${input.kind} “${input.title}”`,
        actor: "Uthai",
        occurredAt: note.createdAt,
      }
      return {
        notes: [note, ...state.notes],
        activity: [activity, ...state.activity],
      }
    }),
  resetProjects: () => set(initialState()),
}))
