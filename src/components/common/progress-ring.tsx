import { motion, useReducedMotion } from "framer-motion";
import { clamp, cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}
export function ProgressRing({
  value,
  size = 148,
  strokeWidth = 11,
  label,
  className,
}: ProgressRingProps) {
  const reduced = useReducedMotion();
  const safe = clamp(value);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safe / 100) * circumference;
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={
            reduced
              ? { strokeDashoffset: offset }
              : { strokeDashoffset: circumference }
          }
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: reduced ? 0 : 0.85,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold tracking-tight">
          {safe}
        </span>
        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label ?? "score"}
        </span>
      </div>
      <span className="sr-only">
        {label ?? "Progress"}: {safe} percent
      </span>
    </div>
  );
}
