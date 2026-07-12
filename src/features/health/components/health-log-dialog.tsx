import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
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
import {
  healthLogSchema,
  type HealthLogFormValues,
} from "@/features/health/schemas/health-log-schema"
import { useHealthStore } from "@/store/health-store"
import type { HealthLogType, MoodLevel } from "@/types/health"

interface HealthLogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultType?: HealthLogType
}

const logTypeLabels: Record<HealthLogType, string> = {
  weight: "Weight",
  meal: "Meal & nutrition",
  workout: "Workout",
  steps: "Steps",
  sleep: "Sleep",
  water: "Water",
  mood: "Mood & energy",
}

const defaultValues = (type: HealthLogType): HealthLogFormValues => ({
  type,
  date: "2026-07-12",
  note: "",
  weightKg: undefined,
  mealName: "",
  calories: undefined,
  proteinGrams: undefined,
  workoutName: "",
  durationMinutes: undefined,
  intensity: "moderate",
  caloriesBurned: undefined,
  steps: undefined,
  hours: undefined,
  quality: 4,
  liters: undefined,
  mood: 4,
  energy: 3,
})

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p className="text-xs text-red-300" role="alert">
      {message}
    </p>
  ) : null
}

function toMoodLevel(value: number | undefined): MoodLevel {
  if (value === 1 || value === 2 || value === 3 || value === 4 || value === 5)
    return value
  return 3
}

export function HealthLogDialog({
  open,
  onOpenChange,
  defaultType = "weight",
}: HealthLogDialogProps) {
  const addHealthLog = useHealthStore((state) => state.addHealthLog)
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<HealthLogFormValues>({
    resolver: zodResolver(healthLogSchema),
    defaultValues: defaultValues(defaultType),
  })
  const type = watch("type")

  useEffect(() => {
    if (open) reset(defaultValues(defaultType))
  }, [defaultType, open, reset])

  const onSubmit = (values: HealthLogFormValues) => {
    const base = { date: values.date, note: values.note || undefined }
    switch (values.type) {
      case "weight":
        addHealthLog({
          ...base,
          type: "weight",
          weightKg: values.weightKg ?? 0,
        })
        break
      case "meal":
        addHealthLog({
          ...base,
          type: "meal",
          mealName: values.mealName ?? "Meal",
          calories: values.calories ?? 0,
          proteinGrams: values.proteinGrams ?? 0,
        })
        break
      case "workout":
        addHealthLog({
          ...base,
          type: "workout",
          workoutName: values.workoutName ?? "Workout",
          durationMinutes: values.durationMinutes ?? 0,
          intensity: values.intensity ?? "moderate",
          caloriesBurned: values.caloriesBurned,
        })
        break
      case "steps":
        addHealthLog({ ...base, type: "steps", steps: values.steps ?? 0 })
        break
      case "sleep":
        addHealthLog({
          ...base,
          type: "sleep",
          hours: values.hours ?? 0,
          quality: toMoodLevel(values.quality),
        })
        break
      case "water":
        addHealthLog({ ...base, type: "water", liters: values.liters ?? 0 })
        break
      case "mood":
        addHealthLog({
          ...base,
          type: "mood",
          mood: toMoodLevel(values.mood),
          energy: toMoodLevel(values.energy),
        })
        break
    }
    toast.success(`${logTypeLabels[values.type]} logged`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Log health data</DialogTitle>
          <DialogDescription>
            Add a manual check-in. This information stays in the current browser
            session.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Log type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-label="Health log type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(logTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="health-log-date">Date</Label>
              <Input id="health-log-date" type="date" {...register("date")} />
              <FieldError message={errors.date?.message} />
            </div>

            {type === "weight" ? (
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="health-weight">Weight (kg)</Label>
                <Input
                  id="health-weight"
                  type="number"
                  min="20"
                  max="350"
                  step="0.1"
                  placeholder="81.4"
                  {...register("weightKg", { valueAsNumber: true })}
                />
                <FieldError message={errors.weightKg?.message} />
              </div>
            ) : null}

            {type === "meal" ? (
              <>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="health-meal">Meal</Label>
                  <Input
                    id="health-meal"
                    placeholder="e.g. Chicken rice bowl"
                    {...register("mealName")}
                  />
                  <FieldError message={errors.mealName?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="health-calories">Calories</Label>
                  <Input
                    id="health-calories"
                    type="number"
                    min="1"
                    placeholder="650"
                    {...register("calories", { valueAsNumber: true })}
                  />
                  <FieldError message={errors.calories?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="health-protein">Protein (g)</Label>
                  <Input
                    id="health-protein"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="45"
                    {...register("proteinGrams", { valueAsNumber: true })}
                  />
                  <FieldError message={errors.proteinGrams?.message} />
                </div>
              </>
            ) : null}

            {type === "workout" ? (
              <>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="health-workout">Workout</Label>
                  <Input
                    id="health-workout"
                    placeholder="e.g. Upper body strength"
                    {...register("workoutName")}
                  />
                  <FieldError message={errors.workoutName?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="health-duration">Duration (minutes)</Label>
                  <Input
                    id="health-duration"
                    type="number"
                    min="1"
                    {...register("durationMinutes", { valueAsNumber: true })}
                  />
                  <FieldError message={errors.durationMinutes?.message} />
                </div>
                <div className="space-y-2">
                  <Label>Intensity</Label>
                  <Controller
                    control={control}
                    name="intensity"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger aria-label="Workout intensity">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="health-burned">
                    Calories burned (optional)
                  </Label>
                  <Input
                    id="health-burned"
                    type="number"
                    min="0"
                    {...register("caloriesBurned", { valueAsNumber: true })}
                  />
                  <FieldError message={errors.caloriesBurned?.message} />
                </div>
              </>
            ) : null}

            {type === "steps" ? (
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="health-steps">Steps</Label>
                <Input
                  id="health-steps"
                  type="number"
                  min="1"
                  placeholder="10000"
                  {...register("steps", { valueAsNumber: true })}
                />
                <FieldError message={errors.steps?.message} />
              </div>
            ) : null}

            {type === "sleep" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="health-sleep">Sleep duration (hours)</Label>
                  <Input
                    id="health-sleep"
                    type="number"
                    min="0.1"
                    max="24"
                    step="0.1"
                    {...register("hours", { valueAsNumber: true })}
                  />
                  <FieldError message={errors.hours?.message} />
                </div>
                <div className="space-y-2">
                  <Label>Sleep quality</Label>
                  <Controller
                    control={control}
                    name="quality"
                    render={({ field }) => (
                      <Select
                        value={String(field.value ?? 4)}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger aria-label="Sleep quality">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <SelectItem key={rating} value={String(rating)}>
                              {rating} / 5
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError message={errors.quality?.message} />
                </div>
              </>
            ) : null}

            {type === "water" ? (
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="health-water">Water (liters)</Label>
                <Input
                  id="health-water"
                  type="number"
                  min="0.1"
                  max="20"
                  step="0.1"
                  placeholder="2.5"
                  {...register("liters", { valueAsNumber: true })}
                />
                <FieldError message={errors.liters?.message} />
              </div>
            ) : null}

            {type === "mood" ? (
              <>
                {(["mood", "energy"] as const).map((fieldName) => (
                  <div key={fieldName} className="space-y-2">
                    <Label className="capitalize">{fieldName}</Label>
                    <Controller
                      control={control}
                      name={fieldName}
                      render={({ field }) => (
                        <Select
                          value={String(field.value ?? 3)}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                        >
                          <SelectTrigger aria-label={`${fieldName} rating`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <SelectItem key={rating} value={String(rating)}>
                                {rating} / 5
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError message={errors[fieldName]?.message} />
                  </div>
                ))}
              </>
            ) : null}

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="health-note">Note</Label>
              <Textarea
                id="health-note"
                rows={2}
                placeholder="Optional context about this check-in"
                {...register("note")}
              />
              <FieldError message={errors.note?.message} />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Log {logTypeLabels[type].toLowerCase()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
