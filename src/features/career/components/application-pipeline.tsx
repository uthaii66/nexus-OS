import { format, parseISO } from "date-fns";
import { Columns3, Eye, Flag, List, SearchX } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { FilterBar } from "@/components/common/filter-bar";
import { SearchInput } from "@/components/common/search-input";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCareerStore } from "@/store/career-store";
import {
  APPLICATION_STAGES,
  type ApplicationStage,
  type JobApplication,
} from "@/types/career";

interface ApplicationPipelineProps {
  onOpenApplication: (id: string) => void;
}

const stageTone = (
  stage: ApplicationStage,
): "neutral" | "info" | "success" | "warning" | "danger" => {
  if (stage === "Offer") return "success";
  if (stage === "Rejected") return "danger";
  if (
    ["Recruiter screen", "Technical interview", "Final interview"].includes(
      stage,
    )
  )
    return "info";
  if (["Applied", "Referral requested"].includes(stage)) return "warning";
  return "neutral";
};

export function ApplicationPipeline({
  onOpenApplication,
}: ApplicationPipelineProps) {
  const applications = useCareerStore((state) => state.applications);
  const [view, setView] = useState<"board" | "table">("board");
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<ApplicationStage | "all">(
    "all",
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return applications.filter((application) => {
      const matchesSearch =
        !normalizedQuery ||
        `${application.company} ${application.role} ${application.location}`
          .toLowerCase()
          .includes(normalizedQuery);
      return (
        matchesSearch &&
        (stageFilter === "all" || application.stage === stageFilter)
      );
    });
  }, [applications, query, stageFilter]);

  const visibleStages =
    stageFilter === "all" ? APPLICATION_STAGES : [stageFilter];

  return (
    <Tabs
      value={view}
      onValueChange={(value) => setView(value as "board" | "table")}
    >
      <FilterBar className="mb-4">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search company, role, or location…"
          className="min-w-0 flex-1 sm:min-w-64"
        />
        <Select
          value={stageFilter}
          onValueChange={(value) =>
            setStageFilter(value as ApplicationStage | "all")
          }
        >
          <SelectTrigger
            className="w-full sm:w-48"
            aria-label="Filter applications by stage"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {APPLICATION_STAGES.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {stage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <TabsList className="w-full sm:w-auto" aria-label="Application view">
          <TabsTrigger value="board" className="flex-1 sm:flex-none">
            <Columns3 aria-hidden="true" className="mr-1.5 size-4" />
            Board
          </TabsTrigger>
          <TabsTrigger value="table" className="flex-1 sm:flex-none">
            <List aria-hidden="true" className="mr-1.5 size-4" />
            Table
          </TabsTrigger>
        </TabsList>
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No applications found"
          description="Try a different search or show all pipeline stages."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setStageFilter("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          <TabsContent value="board" className="mt-0">
            <div className="overflow-x-auto pb-3">
              <div className="flex min-w-max gap-3">
                {visibleStages.map((stage) => {
                  const stageApplications = filtered.filter(
                    (application) => application.stage === stage,
                  );
                  return (
                    <section
                      key={stage}
                      className="w-[278px] rounded-2xl border border-border/70 bg-background/30 p-2.5"
                      aria-label={`${stage} applications`}
                    >
                      <header className="flex items-center justify-between gap-2 px-1.5 pb-2.5 pt-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`size-1.5 rounded-full ${stage === "Offer" ? "bg-success" : stage === "Rejected" ? "bg-destructive" : "bg-primary"}`}
                          />
                          <h3 className="text-xs font-semibold text-foreground">
                            {stage}
                          </h3>
                        </div>
                        <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
                          {stageApplications.length}
                        </span>
                      </header>
                      <div className="space-y-2">
                        {stageApplications.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-border/80 px-3 py-8 text-center text-xs text-muted-foreground">
                            No roles here
                          </div>
                        ) : (
                          stageApplications.map((application) => (
                            <ApplicationCard
                              key={application.id}
                              application={application}
                              onOpen={onOpenApplication}
                            />
                          ))
                        )}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="table" className="mt-0">
            <ApplicationTable
              applications={filtered}
              onOpen={onOpenApplication}
            />
          </TabsContent>
        </>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        {filtered.length} of {applications.length} applications · session-only
        updates
      </p>
    </Tabs>
  );
}

function ApplicationCard({
  application,
  onOpen,
}: {
  application: JobApplication;
  onOpen: (id: string) => void;
}) {
  const moveApplication = useCareerStore((state) => state.moveApplication);
  const togglePriority = useCareerStore((state) => state.togglePriority);
  const initials = application.company
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <article className="rounded-xl border border-border/75 bg-card p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg">
      <div className="flex items-start gap-2.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/[0.08] text-xs font-bold text-primary">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="truncate text-sm font-semibold text-foreground">
              {application.company}
            </h4>
            <Button
              variant="ghost"
              size="icon-sm"
              className="-mr-1 -mt-1"
              aria-label={`${application.priority === "high" ? "Remove priority from" : "Mark priority for"} ${application.company}`}
              onClick={() => togglePriority(application.id)}
            >
              <Flag
                aria-hidden="true"
                className={
                  application.priority === "high"
                    ? "fill-warning text-warning"
                    : "text-muted-foreground"
                }
              />
            </Button>
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {application.role}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <StatusBadge tone="neutral">{application.workMode}</StatusBadge>
        {application.followUpDate && (
          <StatusBadge
            tone={
              application.followUpDate <= "2026-07-13" ? "warning" : "neutral"
            }
          >
            Follow up {format(parseISO(application.followUpDate), "MMM d")}
          </StatusBadge>
        )}
      </div>
      <Select
        value={application.stage}
        onValueChange={(value) =>
          moveApplication(application.id, value as ApplicationStage)
        }
      >
        <SelectTrigger
          className="mt-3 h-8 bg-secondary/45 text-xs"
          aria-label={`Move ${application.company} to another stage`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {APPLICATION_STAGES.map((stage) => (
            <SelectItem key={stage} value={stage}>
              {stage}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="sm"
        className="mt-2 w-full"
        onClick={() => onOpen(application.id)}
      >
        <Eye aria-hidden="true" />
        View details
      </Button>
    </article>
  );
}

function ApplicationTable({
  applications,
  onOpen,
}: {
  applications: JobApplication[];
  onOpen: (id: string) => void;
}) {
  const moveApplication = useCareerStore((state) => state.moveApplication);
  const setFollowUpDate = useCareerStore((state) => state.setFollowUpDate);
  const togglePriority = useCareerStore((state) => state.togglePriority);
  const associateResume = useCareerStore((state) => state.associateResume);
  const resumeVersions = useCareerStore((state) => state.resumeVersions);

  return (
    <div className="overflow-x-auto rounded-xl border border-border/70">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">
          Job applications with editable stage, follow-up, priority, and resume
        </caption>
        <thead className="bg-secondary/45 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <tr>
            <th className="px-4 py-3" scope="col">
              Company & role
            </th>
            <th className="px-3 py-3" scope="col">
              Stage
            </th>
            <th className="px-3 py-3" scope="col">
              Follow-up
            </th>
            <th className="px-3 py-3" scope="col">
              Resume
            </th>
            <th className="px-3 py-3 text-center" scope="col">
              Priority
            </th>
            <th className="px-3 py-3 text-right" scope="col">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr
              key={application.id}
              className="border-b border-border/70 transition-colors last:border-0 hover:bg-white/[0.018]"
            >
              <td className="min-w-72 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                    {application.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">
                      {application.company}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {application.role}
                    </p>
                  </div>
                </div>
              </td>
              <td className="min-w-48 px-3 py-3">
                <Select
                  value={application.stage}
                  onValueChange={(value) =>
                    moveApplication(application.id, value as ApplicationStage)
                  }
                >
                  <SelectTrigger
                    className="h-8 border-transparent bg-secondary/60 text-xs"
                    aria-label={`Stage for ${application.company}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {APPLICATION_STAGES.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        <StatusBadge tone={stageTone(stage)}>
                          {stage}
                        </StatusBadge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td className="min-w-40 px-3 py-3">
                <Input
                  type="date"
                  className="h-8 border-transparent bg-secondary/60 text-xs"
                  value={application.followUpDate ?? ""}
                  onChange={(event) =>
                    setFollowUpDate(
                      application.id,
                      event.target.value || undefined,
                    )
                  }
                  aria-label={`Follow-up date for ${application.company}`}
                />
              </td>
              <td className="min-w-48 px-3 py-3">
                <Select
                  value={application.resumeVersionId ?? "none"}
                  onValueChange={(value) =>
                    associateResume(
                      application.id,
                      value === "none" ? undefined : value,
                    )
                  }
                >
                  <SelectTrigger
                    className="h-8 border-transparent bg-secondary/60 text-xs"
                    aria-label={`Resume for ${application.company}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No resume</SelectItem>
                    {resumeVersions.map((resume) => (
                      <SelectItem key={resume.id} value={resume.id}>
                        {resume.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td className="px-3 py-3 text-center">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Toggle priority for ${application.company}`}
                  onClick={() => togglePriority(application.id)}
                >
                  <Flag
                    aria-hidden="true"
                    className={
                      application.priority === "high"
                        ? "fill-warning text-warning"
                        : "text-muted-foreground"
                    }
                  />
                </Button>
              </td>
              <td className="px-3 py-3 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpen(application.id)}
                >
                  <Eye aria-hidden="true" />
                  Open
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
