import { format, parseISO } from "date-fns"
import {
  ArrowUpRight,
  CalendarDays,
  CircleAlert,
  ListChecks,
} from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { Link } from "react-router-dom"

import { StatusBadge } from "@/components/common/status-badge"
import { Progress } from "@/components/ui/progress"
import type { Project, ProjectMember, ProjectTask } from "@/types/projects"

interface ProjectCardProps {
  project: Project
  tasks: ProjectTask[]
  members: ProjectMember[]
  index: number
}

const statusTone = (status: Project["status"]) => {
  if (status === "active") return "success" as const
  if (status === "on-hold") return "warning" as const
  if (status === "completed") return "info" as const
  return "neutral" as const
}

export function ProjectCard({
  project,
  tasks,
  members,
  index,
}: ProjectCardProps) {
  const reduceMotion = useReducedMotion()
  const openTasks = tasks.filter((task) => task.status !== "done").length

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: reduceMotion ? 0 : index * 0.045 }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-2xl border border-border bg-card/75 p-5 shadow-panel transition-colors hover:border-white/15"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px opacity-80"
        style={{ backgroundColor: project.accent }}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white shadow-sm"
            style={{ backgroundColor: `${project.accent}cc` }}
          >
            {project.name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)}
          </span>
          <div className="min-w-0">
            <StatusBadge tone={statusTone(project.status)}>
              {project.status.replace("-", " ")}
            </StatusBadge>
            <h2 className="mt-2 truncate font-display text-lg font-semibold tracking-tight">
              {project.name}
            </h2>
          </div>
        </div>
        <StatusBadge
          tone={project.priority === "critical" ? "danger" : "neutral"}
        >
          {project.priority}
        </StatusBadge>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
        {project.summary}
      </p>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Overall progress</span>
          <span className="font-medium tabular-nums text-foreground">
            {project.progress}%
          </span>
        </div>
        <Progress
          value={project.progress}
          aria-label={`${project.name} is ${project.progress}% complete`}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 rounded-lg bg-secondary/45 px-2.5 py-2">
          <CalendarDays className="size-3.5" />
          {format(parseISO(project.deadline), "MMM d")}
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-secondary/45 px-2.5 py-2">
          <ListChecks className="size-3.5" />
          {openTasks} open
        </div>
      </div>

      <div className="mt-auto flex items-end justify-between gap-4 pt-5">
        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Team
          </p>
          <div className="flex -space-x-2">
            {members.map((member) => (
              <span
                key={member.id}
                title={`${member.name} · ${member.role}`}
                className="flex size-7 items-center justify-center rounded-full border-2 border-card text-[10px] font-semibold text-white"
                style={{ backgroundColor: member.color }}
              >
                {member.initials}
              </span>
            ))}
          </div>
        </div>
        <Link
          to={`/projects/${project.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Open ${project.name}`}
        >
          Open{" "}
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {project.blockerCount > 0 ? (
        <div className="absolute right-5 top-[118px] flex items-center gap-1 text-[11px] font-medium text-warning">
          <CircleAlert className="size-3.5" /> {project.blockerCount} blocked
        </div>
      ) : null}
    </motion.article>
  )
}
