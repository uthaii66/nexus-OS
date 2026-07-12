import { useMemo, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import {
  Activity,
  Beef,
  Droplets,
  Dumbbell,
  Footprints,
  Gauge,
  MoonStar,
  Plus,
  Scale,
  Sparkles,
  Target,
  Utensils,
} from "lucide-react"

import { ErrorState } from "@/components/common/error-state"
import { LoadingSkeleton } from "@/components/common/loading-skeleton"
import { MetricCard } from "@/components/common/metric-card"
import { PageHeader } from "@/components/common/page-header"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { HealthCharts } from "@/features/health/components/health-charts"
import {
  GoalProgress,
  HabitConsistency,
  ProgressPhotos,
  WorkoutHistory,
} from "@/features/health/components/health-details"
import { HealthLogDialog } from "@/features/health/components/health-log-dialog"
import { RecentCheckIns } from "@/features/health/components/recent-check-ins"
import { useHealthDashboard } from "@/features/health/hooks/use-health-dashboard"
import { calculateHealthSummary, useHealthStore } from "@/store/health-store"
import type { HealthLogType } from "@/types/health"

export function HealthPage() {
  const reduceMotion = useReducedMotion()
  const logs = useHealthStore((state) => state.logs)
  const { data, error, reload } = useHealthDashboard()
  const [logDialogOpen, setLogDialogOpen] = useState(false)
  const [defaultLogType, setDefaultLogType] = useState<HealthLogType>("weight")
  const summary = useMemo(() => calculateHealthSummary(logs), [logs])

  const openLog = (type: HealthLogType) => {
    setDefaultLogType(type)
    setLogDialogOpen(true)
  }

  if (error)
    return <ErrorState description={error} onRetry={() => void reload()} />
  if (!data) return <LoadingSkeleton />

  const metrics = [
    {
      label: "Current weight",
      value: `${summary.currentWeightKg.toFixed(1)} kg`,
      detail: `Target ${summary.targetWeightKg} kg`,
      trend: `−${(summary.startingWeightKg - summary.currentWeightKg).toFixed(1)} kg`,
      trendDirection: "neutral" as const,
      icon: Scale,
      accent: "primary" as const,
    },
    {
      label: "Weekly weight avg",
      value: `${summary.weeklyWeightAverageKg.toFixed(1)} kg`,
      detail: "7 logged readings",
      trend: "−0.8 kg",
      trendDirection: "neutral" as const,
      icon: Activity,
      accent: "success" as const,
    },
    {
      label: "Daily calories avg",
      value: Math.round(summary.dailyCalorieAverage).toLocaleString(),
      detail: `${summary.calorieTarget.toLocaleString()} kcal target`,
      trend: `${Math.round(summary.dailyCalorieAverage - summary.calorieTarget)} kcal`,
      trendDirection: "neutral" as const,
      icon: Utensils,
      accent: "warning" as const,
      progress: (summary.dailyCalorieAverage / summary.calorieTarget) * 100,
    },
    {
      label: "Protein average",
      value: `${Math.round(summary.dailyProteinAverageGrams)} g`,
      detail: `${summary.proteinTargetGrams} g daily target`,
      trend: "3 days below",
      trendDirection: "down" as const,
      icon: Beef,
      accent: "warning" as const,
      progress:
        (summary.dailyProteinAverageGrams / summary.proteinTargetGrams) * 100,
    },
    {
      label: "Workout streak",
      value: `${summary.workoutStreakDays} days`,
      detail: "Best this month: 6",
      trend: "+1 day",
      trendDirection: "up" as const,
      icon: Dumbbell,
      accent: "success" as const,
    },
    {
      label: "Today’s steps",
      value: summary.todaySteps.toLocaleString(),
      detail: `${summary.stepsTarget.toLocaleString()} goal`,
      trend: `${Math.round((summary.todaySteps / summary.stepsTarget) * 100)}%`,
      trendDirection: "neutral" as const,
      icon: Footprints,
      accent: "primary" as const,
      progress: (summary.todaySteps / summary.stepsTarget) * 100,
    },
    {
      label: "Last sleep",
      value: `${summary.lastSleepHours.toFixed(1)} hr`,
      detail: "Quality 4 of 5",
      trend: "+0.4 hr",
      trendDirection: "up" as const,
      icon: MoonStar,
      accent: "primary" as const,
    },
    {
      label: "Water intake",
      value: `${summary.todayWaterLiters.toFixed(1)} L`,
      detail: `${summary.waterTargetLiters} L personal target`,
      trend: `${Math.round((summary.todayWaterLiters / summary.waterTargetLiters) * 100)}%`,
      trendDirection: "neutral" as const,
      icon: Droplets,
      accent: "primary" as const,
      progress: (summary.todayWaterLiters / summary.waterTargetLiters) * 100,
    },
    {
      label: "Body fat",
      value: summary.bodyFatPercent
        ? `${summary.bodyFatPercent}%`
        : "Not tracked",
      detail: "Optional measurement",
      trend: "Add when ready",
      trendDirection: "neutral" as const,
      icon: Gauge,
      accent: "neutral" as const,
    },
  ]

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Wellbeing overview"
        title="Health & fitness"
        description="Track personal goals, daily signals and training consistency. Targets are informational and not medical advice."
        actions={
          <>
            <Button variant="outline" onClick={() => openLog("weight")}>
              <Scale /> Log weight
            </Button>
            <Button onClick={() => openLog("meal")}>
              <Plus /> Log health
            </Button>
          </>
        }
      />

      <motion.section
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.04 } },
        }}
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5"
        aria-label="Health summary"
      >
        {metrics.map((metric) => (
          <motion.div
            key={metric.label}
            variants={{
              hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <MetricCard
              label={metric.label}
              value={metric.value}
              detail={metric.detail}
              trend={metric.trend}
              trendDirection={metric.trendDirection}
              icon={metric.icon}
              accent={metric.accent}
              className="h-full"
            >
              {metric.progress !== undefined ? (
                <Progress
                  value={Math.min(metric.progress, 100)}
                  aria-label={`${metric.label} ${Math.round(metric.progress)} percent of target`}
                />
              ) : null}
            </MetricCard>
          </motion.div>
        ))}
      </motion.section>

      <div className="grid gap-4 xl:grid-cols-2">
        <GoalProgress summary={summary} />
        <HabitConsistency
          habits={data.habitConsistency}
          dailyHabits={data.dailyHabits}
        />
      </div>

      <HealthCharts
        weightTrend={data.weightTrend}
        nutritionTrend={data.nutritionTrend}
        logs={logs}
        targetWeightKg={summary.targetWeightKg}
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <WorkoutHistory logs={logs} onAddWorkout={() => openLog("workout")} />
        <RecentCheckIns logs={logs} />
      </div>

      <ProgressPhotos photos={data.progressPhotos} />

      <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-card/55 px-4 py-3 text-xs text-muted-foreground">
        <Sparkles
          className="size-4 shrink-0 text-indigo-300"
          aria-hidden="true"
        />
        Health trends summarize manually entered mock data and do not provide
        diagnosis or treatment advice.
        <Target
          className="ml-auto hidden size-4 text-muted-foreground sm:block"
          aria-hidden="true"
        />
      </div>

      <HealthLogDialog
        open={logDialogOpen}
        onOpenChange={setLogDialogOpen}
        defaultType={defaultLogType}
      />
    </div>
  )
}

export default HealthPage
