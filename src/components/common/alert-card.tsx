import type { LucideIcon } from "lucide-react";
import { AlertCircle, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AlertSeverity = "info" | "warning" | "danger";

interface AlertCardProps {
  title: string;
  description: string;
  severity?: AlertSeverity;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const severityClass: Record<AlertSeverity, string> = {
  info: "bg-primary/10 text-indigo-300",
  warning: "bg-warning/10 text-amber-300",
  danger: "bg-destructive/10 text-red-300",
};

export function AlertCard({
  title,
  description,
  severity = "warning",
  icon: Icon = AlertCircle,
  actionLabel,
  onAction,
  className,
}: AlertCardProps) {
  const isUrgent = severity === "danger";

  return (
    <div
      role={isUrgent ? "alert" : "status"}
      aria-live={isUrgent ? "assertive" : "polite"}
      className={cn(
        "flex items-start gap-3 rounded-xl border border-border/70 bg-background/35 p-3.5",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl",
          severityClass[severity],
        )}
        aria-hidden="true"
      >
        <Icon className="size-4" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      {actionLabel && onAction ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onAction}
          className="shrink-0 gap-1.5 px-2 text-xs"
        >
          {actionLabel}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Button>
      ) : null}
    </div>
  );
}
