import { useMemo } from "react";
import { format } from "date-fns";
import { motion, useReducedMotion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Banknote,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  FolderKanban,
  GraduationCap,
  HeartPulse,
  Scale,
  TimerReset,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/page-header";
import { SectionCard } from "@/components/common/section-card";
import { MetricCard } from "@/components/common/metric-card";
import { ProgressRing } from "@/components/common/progress-ring";
import { TaskItem } from "@/components/common/task-item";
import { AlertCard } from "@/components/common/alert-card";
import {
  ActivityTimeline,
  type TimelineItem,
} from "@/components/common/activity-timeline";
import { MiniChart } from "@/components/common/mini-chart";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useOverviewStore } from "@/store/overview-store";
import { useUiStore } from "@/store/ui-store";
import type { OverviewMetricId, RecentActivityItem } from "@/types/overview";
import { cn } from "@/lib/utils";

const metricIcons: Record<OverviewMetricId, typeof WalletCards> = {
  spending: WalletCards,
  debt: CircleDollarSign,
  weight: Scale,
  calories: HeartPulse,
  streak: GraduationCap,
  problems: BookOpenCheck,
  applications: BriefcaseBusiness,
  projects: FolderKanban,
};
const activityIcons: Record<RecentActivityItem["type"], LucideIcon> = {
  health: Scale,
  finance: Banknote,
  learning: BookOpenCheck,
  career: BriefcaseBusiness,
  project: CheckCircle2,
};
const categoryStyles = {
  Learning: "bg-indigo-400",
  Health: "bg-emerald-400",
  Career: "bg-violet-400",
  Finance: "bg-amber-400",
  Projects: "bg-sky-400",
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function OverviewPage() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const priorities = useOverviewStore((state) => state.priorities);
  const lifeScore = useOverviewStore((state) => state.lifeScore);
  const metrics = useOverviewStore((state) => state.metrics);
  const schedule = useOverviewStore((state) => state.schedule);
  const alerts = useOverviewStore((state) => state.alerts);
  const weeklyProgress = useOverviewStore((state) => state.weeklyProgress);
  const recentActivity = useOverviewStore((state) => state.recentActivity);
  const togglePriority = useOverviewStore((state) => state.togglePriority);
  const openQuickAdd = useUiStore((state) => state.openQuickAdd);
  const completed = priorities.filter((task) => task.completed).length;
  const timeline = useMemo<TimelineItem[]>(
    () =>
      recentActivity.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        time: item.time,
        icon: activityIcons[item.type],
        tone:
          item.type === "health" || item.type === "project"
            ? "success"
            : item.type === "finance"
              ? "warning"
              : "primary",
      })),
    [recentActivity],
  );
  const itemAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        eyebrow={format(new Date(), "EEEE · d MMMM yyyy")}
        title={`${getGreeting()}, Uthai`}
        description="Your systems are steady. Focus on the three moves that make the rest of today easier."
        actions={
          <>
            <Button variant="outline" onClick={() => navigate("/calendar")}>
              <CalendarDays />
              View schedule
            </Button>
            <Button onClick={() => openQuickAdd({ source: "button" })}>
              Add to Nexus
            </Button>
          </>
        }
      />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: reduced ? 0 : 0.055 } },
        }}
        className="space-y-6"
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(350px,.75fr)]">
          <motion.div variants={itemAnimation}>
            <SectionCard
              title="Today’s focus"
              description={`${completed} of ${priorities.length} priorities completed`}
              action={
                <span className="text-xs font-medium text-muted-foreground">
                  {Math.round((completed / priorities.length) * 100)}%
                </span>
              }
              contentClassName="space-y-1"
            >
              <Progress
                value={(completed / priorities.length) * 100}
                className="mb-4 h-1.5"
              />
              {priorities.map((task) => (
                <TaskItem
                  key={task.id}
                  {...task}
                  onToggle={() => togglePriority(task.id)}
                />
              ))}
            </SectionCard>
          </motion.div>
          <motion.div variants={itemAnimation}>
            <SectionCard
              className="h-full bg-[radial-gradient(circle_at_20%_10%,hsl(var(--primary)/.12),transparent_45%),hsl(var(--card))]"
              title="Life score"
              description="Balanced across five domains"
            >
              <div className="grid items-center gap-5 sm:grid-cols-[160px_1fr] xl:grid-cols-1 2xl:grid-cols-[160px_1fr]">
                <div className="flex justify-center">
                  <ProgressRing value={lifeScore.overall} label="overall" />
                </div>
                <div className="space-y-3">
                  {lifeScore.categories.map((category) => (
                    <div key={category.name}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {category.name}
                        </span>
                        <span className="font-medium">{category.score}</span>
                      </div>
                      <Progress value={category.score} className="h-1.5" />
                    </div>
                  ))}
                  <p className="pt-1 text-xs font-medium text-emerald-300">
                    +{lifeScore.weeklyChange} points from last week
                  </p>
                </div>
              </div>
            </SectionCard>
          </motion.div>
        </div>
        <motion.section
          variants={itemAnimation}
          aria-labelledby="daily-summary"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2
              id="daily-summary"
              className="font-display text-base font-semibold"
            >
              Daily summary
            </h2>
            <span className="text-xs text-muted-foreground">
              Updated for this session
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => {
              const Icon = metricIcons[metric.id];
              return (
                <MetricCard
                  key={metric.id}
                  label={metric.label}
                  value={metric.value}
                  trend={metric.trend}
                  trendDirection={metric.direction}
                  detail={metric.detail}
                  icon={Icon}
                  accent={
                    metric.id === "spending" || metric.id === "debt"
                      ? "warning"
                      : metric.id === "weight" || metric.id === "streak"
                        ? "success"
                        : "primary"
                  }
                >
                  <MiniChart data={metric.sparkline} />
                </MetricCard>
              );
            })}
          </div>
        </motion.section>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,.85fr)]">
          <motion.div variants={itemAnimation}>
            <SectionCard
              title="Upcoming schedule"
              description="Today and the next important date"
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/calendar")}
                >
                  Open calendar
                </Button>
              }
            >
              <div className="space-y-1">
                {schedule.map((event, index) => (
                  <button
                    key={event.id}
                    onClick={() => navigate("/calendar")}
                    className="group grid w-full grid-cols-[52px_1px_1fr] gap-3 rounded-xl p-2.5 text-left transition hover:bg-secondary/45"
                  >
                    <div className="pt-0.5 text-right">
                      <p className="text-xs font-semibold">{event.start}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {index < 4 ? "Today" : "16 Jul"}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "h-full min-h-12 w-0.5 rounded-full",
                        categoryStyles[event.category],
                      )}
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">{event.title}</p>
                        <StatusBadge status={event.category} tone="neutral" />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {event.start}–{event.end}
                        {event.location ? ` · ${event.location}` : ""}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </SectionCard>
          </motion.div>
          <motion.div variants={itemAnimation}>
            <SectionCard
              title="Attention required"
              description="Four signals worth resolving"
            >
              <div className="space-y-2.5">
                {alerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    {...alert}
                    actionLabel={alert.action}
                    onAction={() => navigate(alert.route)}
                  />
                ))}
              </div>
            </SectionCard>
          </motion.div>
        </div>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(330px,.55fr)]">
          <motion.div variants={itemAnimation}>
            <SectionCard
              title="Weekly progress"
              description="Planned work versus completed work"
              action={
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-primary" />
                    Completed
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-secondary-foreground/25" />
                    Planned
                  </span>
                </div>
              }
            >
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyProgress}
                    margin={{ top: 8, right: 4, left: -24, bottom: 0 }}
                  >
                    <CartesianGrid
                      vertical={false}
                      stroke="hsl(var(--border))"
                      strokeDasharray="4 4"
                    />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 11,
                      }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                      tick={{
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 11,
                      }}
                    />
                    <Tooltip
                      cursor={{ fill: "hsl(var(--secondary) / .45)" }}
                      contentStyle={{
                        background: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                    />
                    <Bar
                      dataKey="planned"
                      fill="hsl(var(--secondary-foreground) / .18)"
                      radius={[5, 5, 0, 0]}
                    />
                    <Bar
                      dataKey="completed"
                      fill="hsl(var(--primary))"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border/60 pt-5 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Tasks</p>
                  <p className="mt-1 font-display text-lg font-semibold">
                    30 / 38
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Study</p>
                  <p className="mt-1 font-display text-lg font-semibold">
                    7h 25m
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Workouts</p>
                  <p className="mt-1 font-display text-lg font-semibold">
                    4 / 5
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vs budget</p>
                  <p className="mt-1 font-display text-lg font-semibold text-emerald-300">
                    £96 under
                  </p>
                </div>
              </div>
            </SectionCard>
          </motion.div>
          <motion.div variants={itemAnimation}>
            <SectionCard
              title="Recent activity"
              description="Latest updates across Nexus"
            >
              <ActivityTimeline items={timeline} />
            </SectionCard>
          </motion.div>
        </div>
        <motion.div variants={itemAnimation}>
          <SectionCard
            className="overflow-hidden"
            contentClassName="p-0 sm:p-0"
          >
            <div className="relative grid overflow-hidden p-5 sm:p-6 lg:grid-cols-[1fr_300px] lg:items-center">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  <TimerReset className="size-4" />
                  Weekly rhythm
                </div>
                <h2 className="max-w-xl font-display text-xl font-semibold tracking-tight">
                  Your strongest momentum is learning consistency.
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  Seven focused sessions and four workouts made this a balanced
                  week. Keep tomorrow’s plan deliberately light to protect the
                  streak.
                </p>
                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={() => navigate("/insights")}
                >
                  Explore all insights
                </Button>
              </div>
              <div className="mt-6 h-28 lg:mt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyProgress}>
                    <defs>
                      <linearGradient
                        id="study-fill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="100%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="studyMinutes"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.2}
                      fill="url(#study-fill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </SectionCard>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default OverviewPage;
