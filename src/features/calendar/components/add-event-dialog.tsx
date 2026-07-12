import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarPlus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import type { CalendarEvent, CreateCalendarEventInput } from "@/types/calendar"

const eventSchema = z
  .object({
    title: z.string().trim().min(3, "Add a clear event title.").max(90),
    description: z.string().trim().max(240).optional(),
    type: z.enum([
      "study",
      "workout",
      "interview",
      "bill",
      "project",
      "personal",
    ]),
    start: z.string().min(1, "Choose a start time."),
    end: z.string().min(1, "Choose an end time."),
    location: z.string().trim().max(80).optional(),
    allDay: z.boolean(),
  })
  .refine((values) => new Date(values.end) > new Date(values.start), {
    message: "End time must be after the start time.",
    path: ["end"],
  })

type EventFormValues = z.infer<typeof eventSchema>

interface AddEventDialogProps {
  onAdd: (input: CreateCalendarEventInput) => Promise<CalendarEvent>
}

export function AddEventDialog({ onAdd }: AddEventDialogProps) {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "personal",
      start: "2026-07-13T09:00",
      end: "2026-07-13T10:00",
      location: "",
      allDay: false,
    },
  })

  const onSubmit = async (values: EventFormValues) => {
    await onAdd(values)
    toast.success("Event added to your calendar")
    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CalendarPlus /> Add event
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add calendar event</DialogTitle>
          <DialogDescription>
            Create a study block, deadline, workout, interview, or personal
            event.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="event-title">Event title</Label>
            <Input
              id="event-title"
              {...register("title")}
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title ? (
              <p className="text-destructive text-xs">{errors.title.message}</p>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                defaultValue="personal"
                onValueChange={(value) =>
                  setValue("type", value as EventFormValues["type"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="workout">Workout</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="bill">Bill</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-location">Location</Label>
              <Input
                id="event-location"
                placeholder="Optional"
                {...register("location")}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="event-start">Starts</Label>
              <Input
                id="event-start"
                type="datetime-local"
                {...register("start")}
              />
              {errors.start ? (
                <p className="text-destructive text-xs">{errors.start.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-end">Ends</Label>
              <Input
                id="event-end"
                type="datetime-local"
                {...register("end")}
              />
              {errors.end ? (
                <p className="text-destructive text-xs">{errors.end.message}</p>
              ) : null}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-description">Description</Label>
            <Textarea
              id="event-description"
              rows={3}
              {...register("description")}
            />
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background/40 p-3 text-sm">
            <Checkbox
              checked={watch("allDay")}
              onCheckedChange={(checked) =>
                setValue("allDay", checked === true)
              }
            />
            Treat as an all-day event
          </label>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding…" : "Add event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
