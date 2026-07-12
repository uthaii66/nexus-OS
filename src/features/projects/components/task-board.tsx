import { format, isBefore, parseISO, startOfDay } from "date-fns";
import { CalendarDays, Clock3 } from "lucide-react";

import { StatusBadge } from "@/components/common/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProjectTask, ProjectTaskStatus } from "@/types/projects";

interface TaskBoardProps {
  tasks: ProjectTask[];
  onMoveTask: (taskId: string, status: ProjectTaskStatus) => void;
}

const columns: { status: ProjectTaskStatus; label: string; dot: string }[] = [
  { status: "backlog", label: "Backlog", dot: "bg-muted-foreground" },
  { status: "todo", label: "To do", dot: "bg-indigo-300" },
  { status: "in-progress", label: "In progress", dot: "bg-primary" },
  { status: "blocked", label: "Blocked", dot: "bg-warning" },
  { status: "done", label: "Done", dot: "bg-success" },
];

const priorityTone = (priority: ProjectTask["priority"]) => {
  if (priority === "critical") return "danger" as const;
  if (priority === "high") return "warning" as const;
  return "neutral" as const;
};

export function TaskBoard({ tasks, onMoveTask }: TaskBoardProps) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="grid min-w-[1080px] grid-cols-5 gap-3">
        {columns.map((column) => {
          const columnTasks = tasks.filter(
            (task) => task.status === column.status,
          );
          return (
            <section
              key={column.status}
              aria-labelledby={`column-${column.status}`}
              className="rounded-xl bg-background/45 p-2.5"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={`size-1.5 rounded-full ${column.dot}`} />
                  <h3
                    id={`column-${column.status}`}
                    className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    {column.label}
                  </h3>
                </div>
                <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">
                  {columnTasks.length}
                </span>
              </div>
              <div className="space-y-2.5">
                {columnTasks.map((task) => {
                  const overdue =
                    task.status !== "done" &&
                    isBefore(
                      parseISO(task.dueDate),
                      startOfDay(new Date("2026-07-12")),
                    );
                  return (
                    <article
                      key={task.id}
                      className="rounded-xl border border-border bg-card p-3 shadow-sm"
                    >
                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium leading-5">
                            {task.title}
                          </h4>
                          <StatusBadge
                            tone={priorityTone(task.priority)}
                            className="shrink-0"
                          >
                            {task.priority}
                          </StatusBadge>
                        </div>
                        {task.description ? (
                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                            {task.description}
                          </p>
                        ) : null}
                        <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                          <span
                            className={`flex items-center gap-1 ${overdue ? "text-destructive" : ""}`}
                          >
                            <CalendarDays className="size-3" />
                            {format(parseISO(task.dueDate), "MMM d")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock3 className="size-3" /> {task.estimateHours}h
                          </span>
                        </div>
                        <Select
                          value={task.status}
                          onValueChange={(status) =>
                            onMoveTask(task.id, status as ProjectTaskStatus)
                          }
                        >
                          <SelectTrigger
                            className="mt-3 h-8 text-xs"
                            aria-label={`Move ${task.title}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {columns.map((option) => (
                              <SelectItem
                                key={option.status}
                                value={option.status}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </article>
                  );
                })}
                {columnTasks.length === 0 ? (
                  <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-border px-3 text-center text-xs text-muted-foreground">
                    No tasks here
                  </div>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
