import {
  FolderKanban,
  Grid2X2,
  List,
  ListChecks,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";

import { FilterBar } from "@/components/common/filter-bar";
import { MetricCard } from "@/components/common/metric-card";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectCard } from "@/features/projects/components/project-card";
import { ProjectListRow } from "@/features/projects/components/project-list-row";
import { useProjectsStore } from "@/store/projects-store";
import type { ProjectStatus } from "@/types/projects";

type ViewMode = "grid" | "list";
type StatusFilter = ProjectStatus | "all";

export function ProjectsPage() {
  const projects = useProjectsStore((state) => state.projects);
  const members = useProjectsStore((state) => state.members);
  const tasks = useProjectsStore((state) => state.tasks);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [view, setView] = useState<ViewMode>("grid");

  const visibleProjects = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesQuery =
        !normalized ||
        project.name.toLowerCase().includes(normalized) ||
        project.summary.toLowerCase().includes(normalized) ||
        project.tags.some((tag) => tag.toLowerCase().includes(normalized));
      return matchesQuery && (status === "all" || project.status === status);
    });
  }, [projects, query, status]);

  const openTasks = tasks.filter((task) => task.status !== "done").length;
  const blockers = tasks.filter((task) => task.status === "blocked").length;
  const averageProgress = Math.round(
    projects.reduce((total, project) => total + project.progress, 0) /
      projects.length,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Execution portfolio"
        title="Projects"
        description="Keep active work intentional, visible, and moving toward a clear finish line."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Active projects"
          value={
            projects.filter((project) => project.status === "active").length
          }
          detail={`${projects.length} total initiatives`}
          icon={FolderKanban}
          accent="primary"
        />
        <MetricCard
          label="Open tasks"
          value={openTasks}
          detail="Across the full portfolio"
          icon={ListChecks}
          accent="neutral"
        />
        <MetricCard
          label="Blocked"
          value={blockers}
          detail="Needs a decision or dependency"
          icon={TriangleAlert}
          accent={blockers > 0 ? "warning" : "success"}
        />
        <MetricCard
          label="Average progress"
          value={`${averageProgress}%`}
          detail="Weighted equally by project"
          trend="+7 pts this month"
          trendDirection="up"
          accent="success"
        />
      </div>

      <FilterBar>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search projects or tags…"
          className="min-w-0 flex-1 md:max-w-sm"
        />
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as StatusFilter)}
        >
          <SelectTrigger
            className="w-full sm:w-40"
            aria-label="Filter project status"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="on-hold">On hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <div
          className="flex rounded-xl border border-border bg-background/50 p-1"
          role="group"
          aria-label="Project view"
        >
          <Button
            size="icon-sm"
            variant={view === "grid" ? "secondary" : "ghost"}
            onClick={() => setView("grid")}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
          >
            <Grid2X2 />
          </Button>
          <Button
            size="icon-sm"
            variant={view === "list" ? "secondary" : "ghost"}
            onClick={() => setView("list")}
            aria-label="List view"
            aria-pressed={view === "list"}
          >
            <List />
          </Button>
        </div>
      </FilterBar>

      {visibleProjects.length > 0 ? (
        view === "grid" ? (
          <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {visibleProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                tasks={tasks.filter((task) => task.projectId === project.id)}
                members={members.filter((member) =>
                  project.memberIds.includes(member.id),
                )}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {visibleProjects.map((project) => (
              <ProjectListRow
                key={project.id}
                project={project}
                tasks={tasks.filter((task) => task.projectId === project.id)}
              />
            ))}
          </div>
        )
      ) : (
        <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <FolderKanban className="mx-auto size-8 text-muted-foreground" />
          <h2 className="mt-4 font-display text-lg font-semibold">
            No matching projects
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Clear the search or choose another status.
          </p>
          <Button
            className="mt-5"
            variant="outline"
            onClick={() => {
              setQuery("");
              setStatus("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
