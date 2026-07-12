import { format, parseISO } from "date-fns"
import { motion, useReducedMotion } from "framer-motion"
import {
  BellRing,
  BriefcaseBusiness,
  CalendarDays,
  CalendarPlus,
  Code2,
  FileStack,
  Mail,
  Plus,
  Trophy,
  Users,
} from "lucide-react"
import { useMemo, useState } from "react"
import {
  Funnel,
  FunnelChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import { ChartCard } from "@/components/common/chart-card"
import { MetricCard } from "@/components/common/metric-card"
import { PageHeader } from "@/components/common/page-header"
import { SectionCard } from "@/components/common/section-card"
import { StatusBadge } from "@/components/common/status-badge"
import { Button } from "@/components/ui/button"
import { useCareerStore } from "@/store/career-store"

import { ApplicationDetailsDialog } from "../components/application-details-dialog"
import { ApplicationFormDialog } from "../components/application-form-dialog"
import { ApplicationPipeline } from "../components/application-pipeline"

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "12px",
  boxShadow: "0 18px 45px rgba(0,0,0,.32)",
  color: "hsl(var(--foreground))",
  fontSize: "12px",
}

export function CareerPage() {
  const shouldReduceMotion = useReducedMotion()
  const applications = useCareerStore((state) => state.applications)
  const interviews = useCareerStore((state) => state.interviews)
  const contacts = useCareerStore((state) => state.contacts)
  const resumeVersions = useCareerStore((state) => state.resumeVersions)
  const recentActivity = useCareerStore((state) => state.recentActivity)
  const [formOpen, setFormOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null)
  const [editingApplicationId, setEditingApplicationId] = useState<
    string | null
  >(null)

  const stats = useMemo(() => {
    const followUpsDue = applications.filter(
      (application) =>
        application.followUpDate &&
        application.followUpDate <= "2026-07-15" &&
        !["Rejected"].includes(application.stage),
    ).length
    return {
      total: applications.length,
      thisMonth: applications.filter((application) =>
        application.appliedAt?.startsWith("2026-07"),
      ).length,
      screens: applications.filter(
        (application) => application.stage === "Recruiter screen",
      ).length,
      technical: applications.filter(
        (application) => application.stage === "Technical interview",
      ).length,
      followUpsDue,
      offers: applications.filter(
        (application) => application.stage === "Offer",
      ).length,
    }
  }, [applications])

  const funnelData = useMemo(() => {
    const atOrPast = (stages: string[]) =>
      applications.filter((application) => stages.includes(application.stage))
        .length
    return [
      {
        name: "Tracked",
        value: applications.length,
        fill: "hsl(var(--primary) / .42)",
      },
      {
        name: "Tailored",
        value: atOrPast([
          "Resume tailored",
          "Referral requested",
          "Applied",
          "Recruiter screen",
          "Technical interview",
          "Final interview",
          "Offer",
          "Rejected",
        ]),
        fill: "hsl(var(--primary) / .52)",
      },
      {
        name: "Applied",
        value: atOrPast([
          "Applied",
          "Recruiter screen",
          "Technical interview",
          "Final interview",
          "Offer",
          "Rejected",
        ]),
        fill: "hsl(var(--primary) / .62)",
      },
      {
        name: "Screened",
        value: atOrPast([
          "Recruiter screen",
          "Technical interview",
          "Final interview",
          "Offer",
        ]),
        fill: "hsl(var(--primary) / .72)",
      },
      {
        name: "Interview",
        value: atOrPast(["Technical interview", "Final interview", "Offer"]),
        fill: "hsl(var(--primary) / .82)",
      },
      { name: "Offer", value: stats.offers, fill: "hsl(var(--success) / .9)" },
    ]
  }, [applications, stats.offers])

  const openApplication = (id: string) => {
    setSelectedApplicationId(id)
    setDetailsOpen(true)
  }

  const openEdit = (id: string) => {
    setDetailsOpen(false)
    setEditingApplicationId(id)
    setFormOpen(true)
  }

  const openAdd = () => {
    setEditingApplicationId(null)
    setFormOpen(true)
  }

  const editingApplication = applications.find(
    (application) => application.id === editingApplicationId,
  )
  const entrance = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        eyebrow="Career system"
        title="Move every opportunity forward."
        description="A focused view of the pipeline, conversations, interviews, and follow-ups that deserve attention now."
        actions={
          <Button onClick={openAdd}>
            <Plus aria-hidden="true" />
            Add application
          </Button>
        }
      />

      <motion.section
        {...entrance}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6"
        aria-label="Career metrics"
      >
        <MetricCard
          label="Total applications"
          value={stats.total}
          detail="Across 10 stages"
          icon={BriefcaseBusiness}
          accent="primary"
        />
        <MetricCard
          label="Applied this month"
          value={stats.thisMonth}
          detail="July 2026"
          trend="On target"
          trendDirection="up"
          icon={CalendarPlus}
          accent="primary"
        />
        <MetricCard
          label="Recruiter screens"
          value={stats.screens}
          detail="Active conversations"
          icon={Users}
          accent="neutral"
        />
        <MetricCard
          label="Technical interviews"
          value={stats.technical}
          detail="Preparation in progress"
          icon={Code2}
          accent="warning"
        />
        <MetricCard
          label="Follow-ups due"
          value={stats.followUpsDue}
          detail="By July 15"
          trend="Needs attention"
          trendDirection="neutral"
          icon={BellRing}
          accent="danger"
        />
        <MetricCard
          label="Offers"
          value={stats.offers}
          detail="Decision active"
          trend="Strong momentum"
          trendDirection="up"
          icon={Trophy}
          accent="success"
        />
      </motion.section>

      <motion.section
        {...entrance}
        transition={{
          duration: 0.3,
          delay: shouldReduceMotion ? 0 : 0.05,
          ease: "easeOut",
        }}
        className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]"
      >
        <ChartCard
          title="Application funnel"
          description="Current pipeline volume from tracked opportunity to offer"
          action={<StatusBadge tone="success">7.1% offer rate</StatusBadge>}
        >
          <div
            className="h-[300px] w-full"
            aria-label="Application funnel chart"
          >
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number) => [
                    `${value} opportunities`,
                    "Pipeline",
                  ]}
                />
                <Funnel
                  dataKey="value"
                  data={funnelData}
                  isAnimationActive={!shouldReduceMotion}
                  animationDuration={700}
                >
                  <LabelList
                    position="right"
                    fill="hsl(var(--foreground))"
                    stroke="none"
                    dataKey="name"
                    fontSize={12}
                  />
                  <LabelList
                    position="center"
                    fill="hsl(var(--foreground))"
                    stroke="none"
                    dataKey="value"
                    fontSize={12}
                  />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <SectionCard
          title="Upcoming interviews"
          description="Next conversations in India Standard Time"
          action={
            <StatusBadge tone="info">{interviews.length} scheduled</StatusBadge>
          }
        >
          <div className="space-y-2.5">
            {interviews.map((interview, index) => (
              <article
                key={interview.id}
                className="group flex items-center gap-3 rounded-xl border border-border/70 bg-secondary/20 p-3.5 transition-colors hover:border-primary/20 hover:bg-secondary/35"
              >
                <div className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-primary/10 px-2 py-1.5 text-center">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {format(parseISO(interview.scheduledAt), "MMM")}
                  </span>
                  <span className="font-display text-lg font-bold leading-5 text-foreground">
                    {format(parseISO(interview.scheduledAt), "d")}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {interview.company}
                    </h3>
                    {index === 0 && (
                      <StatusBadge tone="warning">Next</StatusBadge>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {interview.type} · {interview.durationMinutes} min ·{" "}
                    {interview.meetingType}
                  </p>
                  <p className="mt-1 text-xs font-medium text-foreground/80">
                    {format(parseISO(interview.scheduledAt), "EEE · h:mm a")}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => openApplication(interview.applicationId)}
                >
                  Open
                </Button>
              </article>
            ))}
          </div>
        </SectionCard>
      </motion.section>

      <SectionCard
        title="Application pipeline"
        description="Move roles between stages and manage follow-ups, priorities, notes, and resume versions."
        action={<StatusBadge tone="info">Live session view</StatusBadge>}
      >
        <ApplicationPipeline onOpenApplication={openApplication} />
      </SectionCard>

      <section className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
        <SectionCard
          title="Recruiter contacts"
          description="People connected to active opportunities"
          action={<Users aria-hidden="true" className="size-5 text-primary" />}
        >
          <div className="space-y-2">
            {contacts.map((contact) => (
              <article
                key={contact.id}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-secondary/20 p-3"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {contact.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {contact.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {contact.role} · {contact.company}
                  </p>
                </div>
                <Button asChild variant="ghost" size="icon-sm">
                  <a
                    href={`mailto:${contact.email}`}
                    aria-label={`Email ${contact.name}`}
                  >
                    <Mail aria-hidden="true" />
                  </a>
                </Button>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Resume versions"
          description="Targeted narratives in active circulation"
          action={
            <FileStack aria-hidden="true" className="size-5 text-primary" />
          }
        >
          <div className="space-y-2.5">
            {resumeVersions.map((resume) => (
              <article
                key={resume.id}
                className="rounded-xl border border-border/60 bg-secondary/20 p-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {resume.name}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {resume.focus}
                    </p>
                  </div>
                  <StatusBadge tone="neutral">
                    {resume.applicationsCount} roles
                  </StatusBadge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Updated {format(parseISO(resume.updatedAt), "MMM d, yyyy")}
                </p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Recent career activity"
          description="Latest changes across the job search"
          action={
            <CalendarDays aria-hidden="true" className="size-5 text-primary" />
          }
          className="lg:col-span-2 2xl:col-span-1"
        >
          <ol className="space-y-1">
            {recentActivity.slice(0, 6).map((item, index) => (
              <li
                key={item.id}
                className="relative flex gap-3 rounded-xl px-2 py-2.5"
              >
                <div className="relative flex w-3 shrink-0 justify-center">
                  <span className="mt-1.5 size-2 rounded-full border-2 border-card bg-primary" />
                  {index < Math.min(5, recentActivity.length - 1) && (
                    <span className="absolute left-1/2 top-4 h-[calc(100%+.25rem)] w-px -translate-x-1/2 bg-border" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug text-foreground/90">
                    {item.description}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {format(parseISO(item.occurredAt), "MMM d · h:mm a")}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </SectionCard>
      </section>

      <ApplicationFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        application={editingApplication}
      />
      <ApplicationDetailsDialog
        applicationId={selectedApplicationId}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onEdit={openEdit}
      />
    </div>
  )
}

export default CareerPage
