import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  GitBranch,
  Milestone,
  Sparkles,
  Target,
  Users,
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { Link, useParams } from "react-router-dom"

import { EmptyState } from "@/components/common/empty-state"
import { MetricCard } from "@/components/common/metric-card"
import { PageHeader } from "@/components/common/page-header"
import { SectionCard } from "@/components/common/section-card"
import { StatusBadge } from "@/components/common/status-badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddNoteDialog } from "@/features/projects/components/add-note-dialog"
import { AddTaskDialog } from "@/features/projects/components/add-task-dialog"
import { TaskBoard } from "@/features/projects/components/task-board"
import { useProjectsStore } from "@/store/projects-store"

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const project = useProjectsStore((state) =>
    state.projects.find((item) => item.id === projectId),
  )
  const allTasks = useProjectsStore((state) => state.tasks)
  const allMembers = useProjectsStore((state) => state.members)
  const allMilestones = useProjectsStore((state) => state.milestones)
  const allActivity = useProjectsStore((state) => state.activity)
  const allNotes = useProjectsStore((state) => state.notes)
  const moveTask = useProjectsStore((state) => state.moveTask)
  const toggleMilestone = useProjectsStore((state) => state.toggleMilestone)

  if (!project || !projectId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <EmptyState
          icon={GitBranch}
          title="Project not found"
          description="This project may have moved or the link may be incomplete."
          action={
            <Button asChild>
              <Link to="/projects">Return to projects</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const tasks = allTasks.filter((item) => item.projectId === projectId)
  const milestones = allMilestones.filter(
    (item) => item.projectId === projectId,
  )
  const activity = allActivity.filter((item) => item.projectId === projectId)
  const notes = allNotes.filter((item) => item.projectId === projectId)
  const members = allMembers.filter((member) =>
    project.memberIds.includes(member.id),
  )
  const completedTasks = tasks.filter((task) => task.status === "done").length
  const blockedTasks = tasks.filter((task) => task.status === "blocked").length
  const completedMilestones = milestones.filter(
    (milestone) => milestone.completed,
  ).length

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="-ml-2 text-muted-foreground"
      >
        <Link to="/projects">
          <ArrowLeft /> All projects
        </Link>
      </Button>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card/75 p-5 shadow-panel sm:p-7">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px"
          style={{ backgroundColor: project.accent }}
        />
        <PageHeader
          eyebrow="Project workspace"
          title={project.name}
          description={project.description}
          actions={
            <div className="flex flex-wrap gap-2">
              {project.repositoryUrl ? (
                <Button variant="outline" asChild>
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GitBranch /> Repository{" "}
                    <ExternalLink className="size-3.5" />
                  </a>
                </Button>
              ) : null}
              <AddTaskDialog projectId={project.id} />
            </div>
          }
        />
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <StatusBadge
            tone={
              project.status === "active"
                ? "success"
                : project.status === "on-hold"
                  ? "warning"
                  : "neutral"
            }
          >
            {project.status.replace("-", " ")}
          </StatusBadge>
          <StatusBadge
            tone={project.priority === "critical" ? "danger" : "neutral"}
          >
            {project.priority} priority
          </StatusBadge>
          {project.tags.map((tag) => (
            <StatusBadge key={tag}>{tag}</StatusBadge>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Project progress"
          value={`${project.progress}%`}
          detail="Toward the current release"
          icon={Target}
          accent="primary"
        />
        <MetricCard
          label="Task completion"
          value={`${completedTasks}/${tasks.length}`}
          detail={`${tasks.length - completedTasks} actions remain`}
          icon={CheckCircle2}
          accent="success"
        />
        <MetricCard
          label="Deadline"
          value={format(parseISO(project.deadline), "MMM d")}
          detail={format(parseISO(project.deadline), "yyyy")}
          icon={CalendarDays}
          accent="neutral"
        />
        <MetricCard
          label="Blocked tasks"
          value={blockedTasks}
          detail={
            blockedTasks
              ? "Clear before the next milestone"
              : "No current blockers"
          }
          icon={Clock3}
          accent={blockedTasks ? "warning" : "success"}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Tabs defaultValue="board" className="min-w-0">
          <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
            <TabsTrigger value="board">Task board</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notes">Notes & decisions</TabsTrigger>
          </TabsList>

          <TabsContent value="board">
            <SectionCard
              title="Delivery board"
              description="Use each task menu to move work through the session-only board."
              contentClassName="pt-2"
            >
              <TaskBoard tasks={tasks} onMoveTask={moveTask} />
            </SectionCard>
          </TabsContent>

          <TabsContent value="activity">
            <SectionCard
              title="Activity timeline"
              description="A chronological record of meaningful project changes."
            >
              {activity.length > 0 ? (
                <ol className="relative space-y-0 before:absolute before:bottom-3 before:left-[17px] before:top-3 before:w-px before:bg-border">
                  {activity.map((item) => (
                    <li key={item.id} className="relative flex gap-4 py-3">
                      <span className="z-10 flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary">
                        {item.type === "milestone" ? (
                          <Milestone className="size-4" />
                        ) : item.type === "decision" ? (
                          <Sparkles className="size-4" />
                        ) : (
                          <GitBranch className="size-4" />
                        )}
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-sm text-foreground">
                          {item.message}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.actor} ·{" "}
                          {format(parseISO(item.occurredAt), "MMM d, h:mm a")}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No activity recorded yet.
                </p>
              )}
            </SectionCard>
          </TabsContent>

          <TabsContent value="notes">
            <SectionCard
              title="Notes & decisions"
              description="Preserve context so future work starts with the right assumptions."
              action={<AddNoteDialog projectId={project.id} />}
            >
              <div className="grid gap-3 md:grid-cols-2">
                {notes.map((note) => (
                  <article
                    key={note.id}
                    className="rounded-xl border border-border bg-background/45 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <StatusBadge
                        tone={note.kind === "decision" ? "info" : "neutral"}
                      >
                        {note.kind}
                      </StatusBadge>
                      <span className="text-[11px] text-muted-foreground">
                        {format(parseISO(note.createdAt), "MMM d")}
                      </span>
                    </div>
                    <h3 className="mt-3 font-medium">{note.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {note.content}
                    </p>
                    <p className="mt-4 text-xs text-muted-foreground">
                      Recorded by {note.author}
                    </p>
                  </article>
                ))}
              </div>
            </SectionCard>
          </TabsContent>
        </Tabs>

        <aside className="space-y-5">
          <SectionCard
            title="Milestones"
            description={`${completedMilestones} of ${milestones.length} complete`}
          >
            <Progress
              value={
                milestones.length
                  ? (completedMilestones / milestones.length) * 100
                  : 0
              }
              className="mb-5"
            />
            <div className="space-y-1">
              {milestones.map((milestone) => (
                <label
                  key={milestone.id}
                  className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-3 transition hover:bg-secondary/45"
                >
                  <Checkbox
                    checked={milestone.completed}
                    onCheckedChange={() => toggleMilestone(milestone.id)}
                    className="mt-0.5"
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-sm font-medium ${milestone.completed ? "text-muted-foreground line-through" : ""}`}
                    >
                      {milestone.title}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {format(parseISO(milestone.dueDate), "MMM d, yyyy")}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Project team">
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <span
                    className="flex size-9 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.initials}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-secondary/35 p-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="size-3.5" /> {members.length} people
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="size-3.5" /> {notes.length} records
              </span>
            </div>
          </SectionCard>
        </aside>
      </div>
    </div>
  )
}

export default ProjectDetailPage
