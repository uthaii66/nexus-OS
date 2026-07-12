import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendIndicatorProps {
  value: string;
  direction?: "up" | "down" | "neutral";
  positive?: boolean;
  className?: string;
}

export function TrendIndicator({
  value,
  direction = "neutral",
  positive,
  className,
}: TrendIndicatorProps) {
  const Icon =
    direction === "up"
      ? ArrowUpRight
      : direction === "down"
        ? ArrowDownRight
        : ArrowRight;
  const good = positive ?? direction === "up";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        direction === "neutral"
          ? "text-muted-foreground"
          : good
            ? "text-emerald-300"
            : "text-red-300",
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {value}
    </span>
  );
}
