import { Check, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  title: string;
  category: string;
  duration?: string;
  priority?: "low" | "medium" | "high";
  completed?: boolean;
  onToggle?: () => void;
  className?: string;
}
export function TaskItem({
  title,
  category,
  duration,
  priority = "medium",
  completed,
  onToggle,
  className,
}: TaskItemProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-xl border border-transparent p-2.5 transition hover:border-border hover:bg-secondary/35",
        className,
      )}
    >
      <Button
        type="button"
        variant={completed ? "success" : "outline"}
        size="icon-sm"
        onClick={onToggle}
        aria-label={
          completed ? `Mark ${title} incomplete` : `Complete ${title}`
        }
      >
        <Check className={cn("size-4", !completed && "opacity-35")} />
      </Button>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-medium",
            completed && "text-muted-foreground line-through",
          )}
        >
          {title}
        </p>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{category}</span>
          {duration ? (
            <>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="size-3" />
                {duration}
              </span>
            </>
          ) : null}
        </div>
      </div>
      <StatusBadge
        status={priority}
        tone={
          priority === "high"
            ? "danger"
            : priority === "medium"
              ? "warning"
              : "neutral"
        }
      />
    </div>
  );
}
