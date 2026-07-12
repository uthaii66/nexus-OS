import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCareerStore } from "@/store/career-store"
import { formatCurrency } from "@/lib/utils"
import { APPLICATION_STAGES, type JobApplication } from "@/types/career"

import {
  applicationFormSchema,
  type ApplicationFormValues,
} from "../schemas/career-schemas"

interface ApplicationFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application?: JobApplication | null
}

const defaults = (
  application?: JobApplication | null,
): ApplicationFormValues => ({
  company: application?.company ?? "",
  role: application?.role ?? "",
  location: application?.location ?? "",
  workMode: application?.workMode ?? "Hybrid",
  stage: application?.stage ?? "Discovered",
  isPriority: application?.priority === "high",
  discoveredAt: application?.discoveredAt ?? "2026-07-12",
  appliedAt: application?.appliedAt ?? "",
  followUpDate: application?.followUpDate ?? "",
  resumeVersionId: application?.resumeVersionId ?? "none",
  source: application?.source ?? "",
  salaryRange: application?.salaryRange ?? "",
  initialNote: "",
})

export function ApplicationFormDialog({
  open,
  onOpenChange,
  application,
}: ApplicationFormDialogProps) {
  const addApplication = useCareerStore((state) => state.addApplication)
  const updateApplication = useCareerStore((state) => state.updateApplication)
  const resumeVersions = useCareerStore((state) => state.resumeVersions)
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: defaults(application),
  })

  useEffect(() => {
    if (open) reset(defaults(application))
  }, [application, open, reset])

  const onSubmit = (values: ApplicationFormValues) => {
    const input = {
      company: values.company,
      role: values.role,
      location: values.location,
      workMode: values.workMode,
      stage: values.stage,
      priority: values.isPriority ? ("high" as const) : ("standard" as const),
      discoveredAt: values.discoveredAt,
      appliedAt: values.appliedAt || undefined,
      followUpDate: values.followUpDate || undefined,
      resumeVersionId:
        values.resumeVersionId && values.resumeVersionId !== "none"
          ? values.resumeVersionId
          : undefined,
      source: values.source,
      salaryRange: values.salaryRange || undefined,
    }

    if (application) {
      updateApplication(application.id, input)
      toast.success("Application updated", {
        description: `${values.company} · ${values.role}`,
      })
    } else {
      addApplication({ ...input, initialNote: values.initialNote || undefined })
      toast.success("Application added", {
        description: `${values.company} is now in your pipeline.`,
      })
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {application ? "Edit application" : "Add application"}
          </DialogTitle>
          <DialogDescription>
            {application
              ? "Keep the role, next action, and supporting resume current."
              : "Capture a new opportunity and place it in your application pipeline."}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Company"
              error={errors.company?.message}
              htmlFor="career-company"
            >
              <Input
                id="career-company"
                placeholder="e.g. Capital One"
                aria-invalid={Boolean(errors.company)}
                {...register("company")}
              />
            </Field>
            <Field
              label="Role"
              error={errors.role?.message}
              htmlFor="career-role"
            >
              <Input
                id="career-role"
                placeholder="e.g. Senior Software Engineer"
                aria-invalid={Boolean(errors.role)}
                {...register("role")}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr]">
            <Field
              label="Location"
              error={errors.location?.message}
              htmlFor="career-location"
            >
              <Input
                id="career-location"
                placeholder="City, state"
                {...register("location")}
              />
            </Field>
            <Field label="Work mode" htmlFor="career-work-mode">
              <Controller
                control={control}
                name="workMode"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="career-work-mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["Remote", "Hybrid", "On-site"] as const).map(
                        (mode) => (
                          <SelectItem key={mode} value={mode}>
                            {mode}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Pipeline stage" htmlFor="career-stage">
              <Controller
                control={control}
                name="stage"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="career-stage">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {APPLICATION_STAGES.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field label="Resume version" htmlFor="career-resume">
              <Controller
                control={control}
                name="resumeVersionId"
                render={({ field }) => (
                  <Select
                    value={field.value || "none"}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="career-resume">
                      <SelectValue placeholder="No resume selected" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No resume selected</SelectItem>
                      {resumeVersions.map((resume) => (
                        <SelectItem key={resume.id} value={resume.id}>
                          {resume.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              label="Discovered"
              error={errors.discoveredAt?.message}
              htmlFor="career-discovered"
            >
              <Input
                id="career-discovered"
                type="date"
                {...register("discoveredAt")}
              />
            </Field>
            <Field label="Applied" htmlFor="career-applied">
              <Input
                id="career-applied"
                type="date"
                {...register("appliedAt")}
              />
            </Field>
            <Field label="Follow-up" htmlFor="career-follow-up">
              <Input
                id="career-follow-up"
                type="date"
                {...register("followUpDate")}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Source"
              error={errors.source?.message}
              htmlFor="career-source"
            >
              <Input
                id="career-source"
                placeholder="Referral, LinkedIn…"
                {...register("source")}
              />
            </Field>
            <Field label="Salary range" htmlFor="career-salary">
              <Input
                id="career-salary"
                placeholder={`${formatCurrency(150000, "compact")}–${formatCurrency(185000, "compact")}`}
                {...register("salaryRange")}
              />
            </Field>
          </div>

          {!application && (
            <Field
              label="Initial note"
              error={errors.initialNote?.message}
              htmlFor="career-note"
            >
              <Textarea
                id="career-note"
                placeholder="Why this role, referral context, or next preparation step…"
                {...register("initialNote")}
              />
            </Field>
          )}

          <Controller
            control={control}
            name="isPriority"
            render={({ field }) => (
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/70 bg-secondary/25 p-3.5">
                <Checkbox
                  className="mt-0.5"
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
                <span>
                  <span className="block text-sm font-medium text-foreground">
                    Priority opportunity
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Surface this role in follow-ups and pipeline reviews.
                  </span>
                </span>
              </label>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {application ? "Save changes" : "Add to pipeline"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}

function Field({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
