import { format, isBefore, parseISO } from "date-fns"
import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  Clock3,
  Flame,
  RefreshCcw,
  Target,
  Trophy,
} from "lucide-react"
import { useMemo, useState } from "react"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { ChartCard } from "@/components/common/chart-card"
import { MetricCard } from "@/components/common/metric-card"
import { PageHeader } from "@/components/common/page-header"
import { SectionCard } from "@/components/common/section-card"
import { StatusBadge } from "@/components/common/status-badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useLearningStore } from "@/store/learning-store"

import { DsaProblemTable } from "../components/dsa-problem-table"
import { StudySessionDialog } from "../components/study-session-dialog"

const itemStatusTone = {
  upcoming: "neutral",
  "in-progress": "info",
  completed: "success",
} as const

const itemStatusLabel = {
  upcoming: "Upcoming",
  "in-progress": "In progress",
  completed: "Complete",
} as const

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "12px",
  boxShadow: "0 18px 45px rgba(0,0,0,.32)",
  color: "hsl(var(--foreground))",
  fontSize: "12px",
}

export function LearningPage() {
  const shouldReduceMotion = useReducedMotion()
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false)
  const currentStreak = useLearningStore((state) => state.currentStreak)
  const weeklyGoalMinutes = useLearningStore((state) => state.weeklyGoalMinutes)
  const problemsSolvedThisMonth = useLearningStore(
    (state) => state.problemsSolvedThisMonth,
  )
  const independentlySolvedThisMonth = useLearningStore(
    (state) => state.independentlySolvedThisMonth,
  )
  const activity = useLearningStore((state) => state.activity)
  const studyPlan = useLearningStore((state) => state.studyPlan)
  const setStudyPlanStatus = useLearningStore(
    (state) => state.setStudyPlanStatus,
  )
  const topics = useLearningStore((state) => state.topics)
  const weakTopics = useLearningStore((state) => state.weakTopics)
  const problems = useLearningStore((state) => state.problems)
  const sessions = useLearningStore((state) => state.sessions)

  const weeklyMinutes = activity.reduce(
    (total, point) => total + point.minutes,
    0,
  )
  const weeklyGoalProgress = Math.min(
    100,
    Math.round((weeklyMinutes / weeklyGoalMinutes) * 100),
  )
  const completedPlanMinutes = studyPlan
    .filter((item) => item.status === "completed")
    .reduce((total, item) => total + item.durationMinutes, 0)

  const revisionQueue = useMemo(
    () =>
      [...problems]
        .filter((problem) =>
          isBefore(parseISO(problem.revisionDate), parseISO("2026-07-17")),
        )
        .sort((a, b) => a.revisionDate.localeCompare(b.revisionDate))
        .slice(0, 4),
    [problems],
  )

  const recentSessions = [...sessions]
    .sort((a, b) => b.studiedAt.localeCompare(a.studiedAt))
    .slice(0, 4)

  const entrance = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        eyebrow="Learning system"
        title="Deliberate practice, compounding daily."
        description="Keep interview preparation focused, visible, and calibrated by real confidence—not activity alone."
        actions={
          <StudySessionDialog
            open={sessionDialogOpen}
            onOpenChange={setSessionDialogOpen}
          />
        }
      />

      <motion.section
        {...entrance}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Learning summary"
      >
        <MetricCard
          label="Current streak"
          value={`${currentStreak} days`}
          detail="Best: 31 days"
          trend="+4 days this month"
          trendDirection="up"
          icon={Flame}
          accent="warning"
        />
        <MetricCard
          label="Study time"
          value={`${Math.floor(weeklyMinutes / 60)}h ${weeklyMinutes % 60}m`}
          detail={`${weeklyGoalProgress}% of weekly goal`}
          trend="17m remaining"
          trendDirection="up"
          icon={Clock3}
          accent="primary"
        >
          <Progress value={weeklyGoalProgress} className="mt-3 h-1.5" />
        </MetricCard>
        <MetricCard
          label="Problems solved"
          value={problemsSolvedThisMonth}
          detail="This month"
          trend="+5 vs June pace"
          trendDirection="up"
          icon={Trophy}
          accent="success"
        />
        <MetricCard
          label="Independent solves"
          value={`${independentlySolvedThisMonth}/${problemsSolvedThisMonth}`}
          detail="68% without hints"
          trend="+8 percentage points"
          trendDirection="up"
          icon={BrainCircuit}
          accent="primary"
        />
      </motion.section>

      <motion.section
        {...entrance}
        transition={{
          duration: 0.3,
          delay: shouldReduceMotion ? 0 : 0.05,
          ease: "easeOut",
        }}
        className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]"
      >
        <ChartCard
          title="Learning activity"
          description="Focused minutes and completed problems · Jul 6–12"
          action={<StatusBadge tone="success">On pace</StatusBadge>}
        >
          <div
            className="h-[280px] w-full pt-3"
            aria-label="Weekly learning activity chart"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={activity}
                margin={{ top: 10, right: 8, bottom: 0, left: -22 }}
              >
                <defs>
                  <linearGradient
                    id="learning-area"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.28}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="hsl(var(--border))"
                  strokeDasharray="4 5"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  dy={9}
                />
                <YAxis
                  yAxisId="minutes"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                />
                <YAxis
                  yAxisId="problems"
                  orientation="right"
                  hide
                  domain={[0, 5]}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{
                    stroke: "hsl(var(--primary) / .35)",
                    strokeWidth: 1,
                  }}
                  formatter={(value: number, name: string) => [
                    name === "minutes" ? `${value} min` : value,
                    name === "minutes" ? "Focus time" : "Problems",
                  ]}
                />
                <Area
                  yAxisId="minutes"
                  type="monotone"
                  dataKey="minutes"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  fill="url(#learning-area)"
                  isAnimationActive={!shouldReduceMotion}
                  animationDuration={700}
                />
                <Line
                  yAxisId="problems"
                  type="monotone"
                  dataKey="problems"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "hsl(var(--success))", strokeWidth: 0 }}
                  isAnimationActive={!shouldReduceMotion}
                  animationDuration={650}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              Focus minutes
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-success" />
              Problems solved
            </span>
            <span className="ml-auto font-medium text-foreground">
              {weeklyMinutes} / {weeklyGoalMinutes} min
            </span>
          </div>
        </ChartCard>

        <SectionCard
          title="Today’s study plan"
          description={`${completedPlanMinutes} of ${studyPlan.reduce((sum, item) => sum + item.durationMinutes, 0)} planned minutes complete`}
        >
          <div className="space-y-3">
            {studyPlan.map((item, index) => (
              <div
                key={item.id}
                className="group rounded-xl border border-border/70 bg-secondary/25 p-3.5 transition-colors hover:border-primary/20 hover:bg-secondary/40"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p
                        className={`text-sm font-medium ${item.status === "completed" ? "text-muted-foreground line-through" : "text-foreground"}`}
                      >
                        {item.title}
                      </p>
                      <StatusBadge tone={itemStatusTone[item.status]}>
                        {itemStatusLabel[item.status]}
                      </StatusBadge>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {format(parseISO(item.scheduledAt), "h:mm a")}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.durationMinutes} min</span>
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full justify-center"
                  onClick={() =>
                    setStudyPlanStatus(
                      item.id,
                      item.status === "completed" ? "upcoming" : "completed",
                    )
                  }
                >
                  {item.status === "completed" ? (
                    <>
                      <RefreshCcw aria-hidden="true" />
                      Reopen session
                    </>
                  ) : (
                    <>
                      <Check aria-hidden="true" />
                      Mark complete
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </SectionCard>
      </motion.section>

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-[1.25fr_.75fr]">
        <SectionCard
          title="Topics in progress"
          description="Confidence is scored separately from content coverage."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {topics.map((topic) => (
              <article
                key={topic.id}
                className="rounded-xl border border-border/70 bg-secondary/20 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {topic.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {topic.category}
                    </p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-primary">
                    {topic.progress}%
                  </span>
                </div>
                <Progress value={topic.progress} className="mt-4 h-1.5" />
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-medium text-foreground">
                    {topic.confidence}%
                  </span>
                </div>
                <div className="mt-3 flex items-start gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                  <ArrowRight
                    aria-hidden="true"
                    className="mt-0.5 size-3.5 shrink-0 text-primary"
                  />
                  <span>{topic.nextStep}</span>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Revision queue"
          description="Due within the next five days"
        >
          <div className="space-y-1">
            {revisionQueue.map((problem) => (
              <div
                key={problem.id}
                className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-secondary/40"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-warning/10">
                  <RefreshCcw
                    aria-hidden="true"
                    className="size-4 text-warning"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {problem.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {problem.pattern} · {problem.confidence}% confidence
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-foreground">
                    {format(parseISO(problem.revisionDate), "MMM d")}
                  </p>
                  <StatusBadge
                    tone={
                      problem.revisionDate <= "2026-07-12"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {problem.revisionDate <= "2026-07-12" ? "Due" : "Next"}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-warning/15 bg-warning/[0.045] p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-warning">
              <Target aria-hidden="true" className="size-3.5" />
              Weak-topic watchlist
            </div>
            <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
              {weakTopics.map((topic) => (
                <li key={topic}>• {topic}</li>
              ))}
            </ul>
          </div>
        </SectionCard>
      </section>

      <SectionCard
        title="DSA practice library"
        description="Update attempt counts, confidence, revision dates, and independent-solve status inline."
        action={
          <StatusBadge tone="info">{problems.length} tracked</StatusBadge>
        }
        contentClassName="px-0 sm:px-0"
      >
        <div className="px-4 pb-4 sm:px-5">
          <DsaProblemTable />
        </div>
      </SectionCard>

      <SectionCard
        title="Recent study sessions"
        description="Your latest focused blocks across the learning plan."
        action={<BookOpen aria-hidden="true" className="size-5 text-primary" />}
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {recentSessions.map((session) => (
            <article
              key={session.id}
              className="rounded-xl border border-border/70 bg-secondary/20 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <StatusBadge tone="info">
                  {session.durationMinutes} min
                </StatusBadge>
                <span className="text-xs text-muted-foreground">
                  Focus {session.focusScore}/10
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                {session.topic}
              </h3>
              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                {session.category}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {format(parseISO(session.studiedAt), "EEE, MMM d · h:mm a")}
              </p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

export default LearningPage
