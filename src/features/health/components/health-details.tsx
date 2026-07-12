import { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  Activity,
  AlertTriangle,
  Camera,
  Check,
  Dumbbell,
  Flag,
  Footprints,
  MoonStar,
  Target,
  Trash2,
  TrendingDown,
} from "lucide-react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { EmptyState } from "@/components/common/empty-state";
import { SectionCard } from "@/components/common/section-card";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useHealthStore } from "@/store/health-store";
import type {
  DailyHabitPoint,
  HabitConsistency,
  HealthLog,
  HealthSummary,
  ProgressPhoto,
  WorkoutLog,
} from "@/types/health";

interface GoalProgressProps {
  summary: HealthSummary;
}

interface HabitConsistencyProps {
  habits: HabitConsistency[];
  dailyHabits: DailyHabitPoint[];
}

interface WorkoutHistoryProps {
  logs: HealthLog[];
  onAddWorkout: () => void;
}

interface ProgressPhotosProps {
  photos: ProgressPhoto[];
}

const habitAccent = {
  blue: "[&>div]:bg-sky-400",
  green: "[&>div]:bg-emerald-400",
  amber: "[&>div]:bg-amber-400",
  violet: "[&>div]:bg-violet-400",
};

export function GoalProgress({ summary }: GoalProgressProps) {
  const totalGoal = summary.startingWeightKg - summary.targetWeightKg;
  const progress =
    ((summary.startingWeightKg - summary.currentWeightKg) / totalGoal) * 100;
  const remaining = Math.max(
    summary.currentWeightKg - summary.targetWeightKg,
    0,
  );

  return (
    <SectionCard
      title="Weight goal"
      description="Steady progress, measured without judgment"
      contentClassName="space-y-5"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Progress
          </p>
          <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground">
            {Math.round(progress)}%
          </p>
        </div>
        <span className="flex size-12 items-center justify-center rounded-2xl bg-success/10 text-emerald-300">
          <TrendingDown className="size-5" aria-hidden="true" />
        </span>
      </div>
      <Progress value={progress} className="h-2.5 [&>div]:bg-emerald-400" />
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-secondary/30 p-3">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Started
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {summary.startingWeightKg} kg
          </p>
        </div>
        <div className="bg-primary/8 rounded-xl p-3">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Current
          </p>
          <p className="mt-1 text-sm font-semibold text-indigo-200">
            {summary.currentWeightKg} kg
          </p>
        </div>
        <div className="rounded-xl bg-secondary/30 p-3">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Target
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {summary.targetWeightKg} kg
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Flag className="size-3.5 text-emerald-300" aria-hidden="true" />
        {remaining.toFixed(1)} kg remaining · 4.8 kg changed since March
      </div>
    </SectionCard>
  );
}

export function HabitConsistency({
  habits,
  dailyHabits,
}: HabitConsistencyProps) {
  return (
    <SectionCard
      title="Habit consistency"
      description="Completion across the current week"
      contentClassName="space-y-5"
    >
      <div
        className="grid grid-cols-7 gap-1.5"
        aria-label="Seven day movement consistency"
      >
        {dailyHabits.map((day) => (
          <div key={day.date} className="space-y-2 text-center">
            <span
              className={`mx-auto flex size-8 items-center justify-center rounded-lg border ${
                day.workoutComplete
                  ? "bg-success/12 border-success/20 text-emerald-300"
                  : "border-border/70 bg-secondary/30 text-muted-foreground"
              }`}
              title={`${format(parseISO(day.date), "EEEE")}: ${day.workoutComplete ? "movement complete" : "recovery"}`}
            >
              {day.workoutComplete ? (
                <Check className="size-3.5" />
              ) : (
                <span className="size-1 rounded-full bg-current" />
              )}
            </span>
            <p className="text-[10px] uppercase text-muted-foreground">
              {format(parseISO(day.date), "EEEEE")}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {habits.map((habit) => {
          const percentage = (habit.completedDays / habit.targetDays) * 100;
          return (
            <div key={habit.id} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-foreground">
                  {habit.name}
                </span>
                <span className="text-muted-foreground">
                  {habit.completedDays}/{habit.targetDays} {habit.unit}
                </span>
              </div>
              <Progress
                value={percentage}
                className={habitAccent[habit.accent]}
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-warning/15 bg-warning/5 p-3">
        <AlertTriangle
          className="mt-0.5 size-4 shrink-0 text-amber-300"
          aria-hidden="true"
        />
        <div>
          <p className="text-xs font-medium text-foreground">
            Protein needs attention
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Your logged intake has been below the personal target for three
            consecutive days.
          </p>
        </div>
      </div>
    </SectionCard>
  );
}

export function WorkoutHistory({ logs, onAddWorkout }: WorkoutHistoryProps) {
  const [pendingDelete, setPendingDelete] = useState<WorkoutLog | null>(null);
  const deleteHealthLog = useHealthStore((state) => state.deleteHealthLog);
  const workouts = logs
    .filter((log): log is WorkoutLog => log.type === "workout")
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, 6);

  return (
    <>
      <SectionCard
        title="Workout history"
        description="Recent movement and training sessions"
        action={
          <Button size="sm" variant="outline" onClick={onAddWorkout}>
            <Dumbbell /> Log workout
          </Button>
        }
        contentClassName="space-y-2"
      >
        {workouts.length ? (
          workouts.map((workout) => (
            <article
              key={workout.id}
              className="group flex items-center gap-3 rounded-xl border border-border/60 bg-secondary/20 p-3"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-indigo-300">
                <Dumbbell className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {workout.workoutName}
                  </p>
                  <StatusBadge
                    tone={
                      workout.intensity === "high"
                        ? "warning"
                        : workout.intensity === "low"
                          ? "neutral"
                          : "info"
                    }
                  >
                    {workout.intensity}
                  </StatusBadge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {format(parseISO(workout.date), "EEE, MMM d")} ·{" "}
                  {workout.durationMinutes} min
                  {workout.caloriesBurned
                    ? ` · ${workout.caloriesBurned} kcal`
                    : ""}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="opacity-70 hover:text-red-300 sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100"
                onClick={() => setPendingDelete(workout)}
                aria-label={`Delete ${workout.workoutName}`}
              >
                <Trash2 />
              </Button>
            </article>
          ))
        ) : (
          <EmptyState
            icon={Dumbbell}
            title="No workouts logged"
            description="Log your first workout to begin a session history."
            action={<Button onClick={onAddWorkout}>Log workout</Button>}
          />
        )}
      </SectionCard>

      <ConfirmationDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title="Delete workout log?"
        description={`This removes “${pendingDelete?.workoutName ?? "this workout"}” from the current session.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteHealthLog(pendingDelete.id);
          toast.success("Workout log deleted");
          setPendingDelete(null);
        }}
      />
    </>
  );
}

export function ProgressPhotos({ photos }: ProgressPhotosProps) {
  return (
    <SectionCard
      title="Progress photos"
      description="Private visual checkpoints · placeholders only in Phase 1"
      contentClassName="grid gap-3 sm:grid-cols-3"
    >
      {photos.map((photo, index) => (
        <article
          key={photo.id}
          className="relative flex min-h-40 flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-secondary/20 text-center"
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(circle at ${30 + index * 20}% 20%, rgba(99,102,241,.18), transparent 45%)`,
            }}
          />
          <span className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-background/50 text-muted-foreground">
            <Camera className="size-4" aria-hidden="true" />
          </span>
          <p className="relative mt-3 text-sm font-medium text-foreground">
            {photo.label}
          </p>
          <p className="relative mt-1 text-xs text-muted-foreground">
            {format(parseISO(photo.date), "MMM d, yyyy")}
          </p>
        </article>
      ))}
      <div className="flex items-center gap-2 text-xs text-muted-foreground sm:col-span-3">
        <Camera className="size-3.5" aria-hidden="true" />
        Photo upload and secure storage will be connected in a later phase.
      </div>
    </SectionCard>
  );
}

export function DailySignals({
  dailyHabits,
}: {
  dailyHabits: DailyHabitPoint[];
}) {
  const latest = dailyHabits[dailyHabits.length - 1];
  if (!latest) return null;

  const signals = [
    { label: "Steps", value: latest.steps.toLocaleString(), icon: Footprints },
    { label: "Sleep", value: `${latest.sleepHours} hr`, icon: MoonStar },
    { label: "Water", value: `${latest.waterLiters} L`, icon: Activity },
    {
      label: "Movement",
      value: latest.workoutComplete ? "Complete" : "Recovery",
      icon: Target,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {signals.map((signal) => (
        <div
          key={signal.label}
          className="rounded-xl border border-border/60 bg-secondary/20 p-3"
        >
          <signal.icon className="size-4 text-indigo-300" aria-hidden="true" />
          <p className="mt-3 text-[10px] uppercase tracking-wide text-muted-foreground">
            {signal.label}
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {signal.value}
          </p>
        </div>
      ))}
    </div>
  );
}
