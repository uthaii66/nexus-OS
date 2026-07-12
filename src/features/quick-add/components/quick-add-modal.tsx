import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addMinutes, format } from "date-fns"
import { ArrowLeft, CheckCircle2, Command, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { quickAddActions } from "@/features/quick-add/quick-add-actions"
import { quickAddSchema, type QuickAddValues } from "@/features/quick-add/schemas/quick-add-schema"
import { useUiStore } from "@/store/ui-store"
import { useSessionActivityStore } from "@/store/session-activity-store"
import { useFinanceStore } from "@/store/finance-store"
import { useHealthStore } from "@/store/health-store"
import { useLearningStore } from "@/store/learning-store"
import { useCareerStore } from "@/store/career-store"
import { useProjectsStore } from "@/store/projects-store"
import { useCalendarStore } from "@/store/calendar-store"
import { APPLICATION_STAGES, type ApplicationStage } from "@/types/career"
import { LEARNING_CATEGORIES, type LearningCategory } from "@/types/learning"
import { transactionCategories, type TransactionCategory } from "@/types/finance"
import type { CalendarEventType } from "@/types/calendar"
import { createId } from "@/lib/utils"

const today = () => format(new Date(), "yyyy-MM-dd")
const defaults = (action: QuickAddValues["action"]): QuickAddValues => ({ action, date: today(), recurring: false, title: "", company: "", role: "", notes: "" })

function FieldError({ message }: { message?: string }) { return message ? <p className="mt-1.5 text-xs text-red-300" role="alert">{message}</p> : null }

function financeCategory(value: string | undefined, income: boolean): TransactionCategory {
  if (income) return "Income"
  return (transactionCategories as readonly string[]).includes(value ?? "") ? value as TransactionCategory : "Other"
}

function learningCategory(value: string | undefined): LearningCategory {
  return (LEARNING_CATEGORIES as readonly string[]).includes(value ?? "") ? value as LearningCategory : "Python"
}

function applicationStage(value: string | undefined): ApplicationStage {
  return (APPLICATION_STAGES as readonly string[]).includes(value ?? "") ? value as ApplicationStage : "Applied"
}

function eventType(value: string | undefined): CalendarEventType {
  const values: CalendarEventType[] = ["study", "workout", "interview", "bill", "project", "personal"]
  return values.includes(value as CalendarEventType) ? value as CalendarEventType : "personal"
}

export function QuickAddModal() {
  const open = useUiStore((state) => state.quickAddOpen)
  const selectedAction = useUiStore((state) => state.quickAddAction)
  const close = useUiStore((state) => state.closeQuickAdd)
  const setAction = useUiStore((state) => state.setQuickAddAction)
  const addEntry = useSessionActivityStore((state) => state.addEntry)
  const addTransaction = useFinanceStore((state) => state.addTransaction)
  const logWeight = useHealthStore((state) => state.logWeight)
  const logMeal = useHealthStore((state) => state.logMeal)
  const logWorkout = useHealthStore((state) => state.logWorkout)
  const addStudySession = useLearningStore((state) => state.addStudySession)
  const applications = useCareerStore((state) => state.applications)
  const addApplication = useCareerStore((state) => state.addApplication)
  const updateApplication = useCareerStore((state) => state.updateApplication)
  const projects = useProjectsStore((state) => state.projects)
  const addProjectTask = useProjectsStore((state) => state.addTask)
  const addCalendarEvent = useCalendarStore((state) => state.addEvent)
  const form = useForm<QuickAddValues>({ resolver: zodResolver(quickAddSchema), defaultValues: defaults(selectedAction ?? "note") })
  useEffect(() => { if (selectedAction) form.reset(defaults(selectedAction)) }, [form, selectedAction])
  const actionConfig = quickAddActions.find((action) => action.id === selectedAction)
  const ActionIcon = actionConfig?.icon

  const onSubmit = (values: QuickAddValues) => {
    if (values.action === "expense" || values.action === "income") {
      addTransaction({ description: values.notes || (values.action === "expense" ? "Quick-added expense" : "Quick-added income"), amount: values.amount ?? 0, type: values.action, category: financeCategory(values.category, values.action === "income"), date: values.date, account: "Monzo Current", recurring: values.recurring, note: values.notes })
    } else if (values.action === "weight") {
      logWeight({ date: values.date, weightKg: values.value ?? 0, note: values.notes })
    } else if (values.action === "meal") {
      logMeal({ date: values.date, mealName: values.title ?? "Meal", calories: values.calories ?? 0, proteinGrams: values.protein ?? 0, note: values.notes })
    } else if (values.action === "workout") {
      logWorkout({ date: values.date, workoutName: values.title ?? "Workout", durationMinutes: values.duration ?? 0, intensity: "moderate", note: values.notes })
    } else if (values.action === "study-session") {
      addStudySession({ category: learningCategory(values.category), topic: values.title ?? "Focused study", durationMinutes: values.duration ?? 0, studiedAt: `${values.date}T18:00:00.000Z`, focusScore: 4, notes: values.notes })
    } else if (values.action === "job-application") {
      addApplication({ company: values.company ?? "Unknown company", role: values.role ?? "Role", location: "Not specified", workMode: "Remote", stage: applicationStage(values.stage), priority: "standard", discoveredAt: values.date, appliedAt: applicationStage(values.stage) === "Applied" ? values.date : undefined, source: "Quick add", initialNote: values.notes })
    } else if (values.action === "application-update") {
      const match = applications.find((application) => application.company.toLowerCase() === values.company?.toLowerCase())
      if (!match) {
        toast.error("Application not found", { description: `No application matches “${values.company}”. Add it first or update it from Career.` })
        return
      }
      updateApplication(match.id, { stage: applicationStage(values.stage) })
    } else if (values.action === "project-task") {
      const project = projects.find((candidate) => candidate.name === values.project) ?? projects[0]
      if (!project) {
        toast.error("No project available")
        return
      }
      addProjectTask(project.id, { title: values.title ?? "New task", description: values.notes, status: "todo", priority: "medium", dueDate: values.date, estimateHours: 1 })
    } else if (values.action === "calendar-event") {
      const start = new Date(`${values.date}T${values.time || "09:00"}:00`)
      addCalendarEvent({ title: values.title ?? "New event", description: values.notes, type: eventType(values.category), start: start.toISOString(), end: addMinutes(start, 60).toISOString(), allDay: !values.time })
    }
    addEntry({ id: createId(values.action), action: values.action, createdAt: new Date().toISOString(), payload: { title: values.title, amount: values.amount, value: values.value, calories: values.calories, protein: values.protein, duration: values.duration, date: values.date, time: values.time, category: values.category, company: values.company, role: values.role, stage: values.stage, project: values.project, notes: values.notes, recurring: values.recurring } })
    toast.success(`${actionConfig?.label ?? "Entry"} saved`, { description: "Your session data has been updated.", icon: <CheckCircle2 className="size-4" /> })
    close()
    form.reset(defaults("note"))
  }

  return <Dialog open={open} onOpenChange={(next) => { if (!next) close() }}><DialogContent className="bottom-0 left-0 top-auto max-h-[94vh] max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-b-none rounded-t-3xl p-0 data-[state=open]:slide-in-from-bottom sm:left-1/2 sm:top-1/2 sm:max-h-[88vh] sm:max-w-2xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl"><DialogHeader className="sticky top-0 z-10 border-b border-border bg-popover/95 px-5 py-5 pr-12 backdrop-blur-xl sm:px-6">{selectedAction ? <div className="mb-2"><Button type="button" variant="ghost" size="sm" className="-ml-2" onClick={() => setAction(undefined)}><ArrowLeft />All actions</Button></div> : null}<DialogTitle className="flex items-center gap-2">{actionConfig && ActionIcon ? <><ActionIcon className="size-5 text-primary" />{actionConfig.label}</> : <><Sparkles className="size-5 text-primary" />Quick add</>}</DialogTitle><DialogDescription>{actionConfig?.description ?? "Capture an update anywhere in your personal operating system."}</DialogDescription></DialogHeader>{!selectedAction ? <div className="grid gap-2 p-5 sm:grid-cols-2 sm:p-6">{quickAddActions.map((action) => { const Icon = action.icon; return <button key={action.id} type="button" onClick={() => setAction(action.id)} className="group flex items-start gap-3 rounded-xl border border-border bg-background/35 p-3.5 text-left transition hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/[0.055]"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition group-hover:bg-primary/10 group-hover:text-indigo-300"><Icon className="size-4.5" /></span><span><span className="block text-sm font-medium">{action.label}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{action.description}</span></span></button> })}<div className="col-span-full mt-2 flex items-center justify-center gap-2 text-[11px] text-muted-foreground"><Command className="size-3.5" /><span>Shortcut</span><kbd className="rounded border border-border bg-secondary px-1.5 py-0.5">⌘ ⇧ A</kbd></div></div> : <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-5 sm:p-6">{["expense", "income"].includes(selectedAction) ? <><div><Label htmlFor="qa-amount">Amount</Label><div className="relative mt-2"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span><Input id="qa-amount" type="number" min="0" step="0.01" className="pl-7" {...form.register("amount")} /></div><FieldError message={form.formState.errors.amount?.message} /></div><div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="qa-category">Category</Label><Input id="qa-category" className="mt-2" placeholder={selectedAction === "expense" ? "e.g. Groceries" : "e.g. Salary"} {...form.register("category")} /></div><div><Label htmlFor="qa-date">Date</Label><Input id="qa-date" className="mt-2" type="date" {...form.register("date")} /><FieldError message={form.formState.errors.date?.message} /></div></div><Controller control={form.control} name="recurring" render={({ field }) => <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-background/30 p-3 text-sm"><Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />Mark as recurring</label>} /></> : null}{selectedAction === "weight" ? <div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="qa-value">Weight (kg)</Label><Input id="qa-value" className="mt-2" type="number" min="20" max="500" step="0.1" {...form.register("value")} /><FieldError message={form.formState.errors.value?.message} /></div><div><Label htmlFor="qa-date">Date</Label><Input id="qa-date" className="mt-2" type="date" {...form.register("date")} /></div></div> : null}{["meal", "workout", "study-session", "project-task", "calendar-event", "note"].includes(selectedAction) ? <div><Label htmlFor="qa-title">{selectedAction === "note" ? "Note title" : selectedAction === "calendar-event" ? "Event title" : "Title"}</Label><Input id="qa-title" className="mt-2" placeholder={selectedAction === "meal" ? "e.g. Chicken rice bowl" : selectedAction === "project-task" ? "What needs to be done?" : "Add a clear title"} {...form.register("title")} /><FieldError message={form.formState.errors.title?.message} /></div> : null}{selectedAction === "meal" ? <div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="qa-calories">Calories</Label><Input id="qa-calories" className="mt-2" type="number" min="0" {...form.register("calories")} /></div><div><Label htmlFor="qa-protein">Protein (g)</Label><Input id="qa-protein" className="mt-2" type="number" min="0" step="0.1" {...form.register("protein")} /></div></div> : null}{["workout", "study-session"].includes(selectedAction) ? <div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="qa-duration">Duration (minutes)</Label><Input id="qa-duration" className="mt-2" type="number" min="1" {...form.register("duration")} /><FieldError message={form.formState.errors.duration?.message} /></div><div><Label htmlFor="qa-category">{selectedAction === "workout" ? "Workout type" : "Topic"}</Label><Input id="qa-category" className="mt-2" placeholder={selectedAction === "workout" ? "Strength" : "Python"} {...form.register("category")} /></div></div> : null}{["job-application", "application-update"].includes(selectedAction) ? <><div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="qa-company">Company</Label><Input id="qa-company" className="mt-2" placeholder="Company name" {...form.register("company")} /><FieldError message={form.formState.errors.company?.message} /></div>{selectedAction === "job-application" ? <div><Label htmlFor="qa-role">Role</Label><Input id="qa-role" className="mt-2" placeholder="Role title" {...form.register("role")} /><FieldError message={form.formState.errors.role?.message} /></div> : null}</div><div><Label>Application stage</Label><Controller control={form.control} name="stage" render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger className="mt-2"><SelectValue placeholder="Select stage" /></SelectTrigger><SelectContent>{["Discovered", "Reviewing", "Resume tailored", "Referral requested", "Applied", "Recruiter screen", "Technical interview", "Final interview", "Offer", "Rejected"].map((stage) => <SelectItem key={stage} value={stage}>{stage}</SelectItem>)}</SelectContent></Select>} /></div></> : null}{selectedAction === "project-task" ? <div><Label>Project</Label><Controller control={form.control} name="project" render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger className="mt-2"><SelectValue placeholder="Choose project" /></SelectTrigger><SelectContent>{["Terra-Zone", "Uthai Nexus", "Personal Portfolio", "Ramayana Game", "Finance Tracker"].map((project) => <SelectItem key={project} value={project}>{project}</SelectItem>)}</SelectContent></Select>} /></div> : null}{selectedAction === "calendar-event" ? <div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="qa-date">Date</Label><Input id="qa-date" className="mt-2" type="date" {...form.register("date")} /></div><div><Label htmlFor="qa-time">Start time</Label><Input id="qa-time" className="mt-2" type="time" {...form.register("time")} /></div></div> : !["expense", "income", "weight", "job-application", "application-update"].includes(selectedAction) ? <div><Label htmlFor="qa-date">Date</Label><Input id="qa-date" className="mt-2" type="date" {...form.register("date")} /></div> : null}<div><Label htmlFor="qa-notes">Notes <span className="font-normal text-muted-foreground">(optional)</span></Label><Textarea id="qa-notes" className="mt-2" placeholder="Add context that will be useful later…" {...form.register("notes")} /></div><div className="sticky bottom-0 -mx-5 -mb-5 flex items-center justify-end gap-2 border-t border-border bg-popover/95 px-5 py-4 backdrop-blur-xl sm:-mx-6 sm:-mb-6 sm:px-6"><Button type="button" variant="ghost" onClick={close}>Cancel</Button><Button type="submit" disabled={form.formState.isSubmitting}>Save to Nexus</Button></div></form>}</DialogContent></Dialog>
}
