import { format, parseISO } from "date-fns";
import { ArrowRight, CircleAlert } from "lucide-react";
import { Link } from "react-router-dom";

import { StatusBadge } from "@/components/common/status-badge";
import { Progress } from "@/components/ui/progress";
import type { Project, ProjectTask } from "@/types/projects";

interface ProjectListRowProps {
  project: Project;
  tasks: ProjectTask[];
}

export function ProjectListRow({ project, tasks }: ProjectListRowProps) {
  const activeTasks = tasks.filter((task) => task.status !== "done").length;

  return (
    <article className="grid gap-4 rounded-xl border border-border bg-card/65 p-4 transition hover:border-white/15 md:grid-cols-[minmax(230px,1.5fr)_110px_160px_110px_40px] md:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: project.accent }}
        />
        <div className="min-w-0">
          <h2 className="truncate font-medium text-foreground">
            {project.name}
          </h2>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {project.summary}
          </p>
        </div>
      </div>
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
      <div>
        <div className="mb-1.5 flex justify-between text-[11px] text-muted-foreground">
          <span>{project.progress}%</span>
          <span>{activeTasks} open</span>
        </div>
        <Progress value={project.progress} className="h-1.5" />
      </div>
      <div className="text-xs text-muted-foreground">
        <span className="block">
          Due {format(parseISO(project.deadline), "MMM d")}
        </span>
        {project.blockerCount > 0 ? (
          <span className="mt-1 flex items-center gap-1 text-warning">
            <CircleAlert className="size-3" /> {project.blockerCount} blocked
          </span>
        ) : null}
      </div>
      <Link
        to={`/projects/${project.id}`}
        className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Open ${project.name}`}
      >
        <ArrowRight className="size-4" />
      </Link>
    </article>
  );
}
