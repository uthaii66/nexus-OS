import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
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
import { useProjectsStore } from "@/store/projects-store"

const taskSchema = z.object({
  title: z.string().trim().min(3, "Use at least 3 characters.").max(90),
  description: z.string().trim().max(240).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["backlog", "todo", "in-progress", "blocked", "done"]),
  dueDate: z.string().min(1, "Choose a due date."),
  estimateHours: z.coerce.number().min(0.5).max(80),
})

type TaskFormValues = z.infer<typeof taskSchema>

interface AddTaskDialogProps {
  projectId: string
}

export function AddTaskDialog({ projectId }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const addTask = useProjectsStore((state) => state.addTask)
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      dueDate: "2026-07-20",
      estimateHours: 2,
    },
  })

  const onSubmit = (values: TaskFormValues) => {
    addTask(projectId, values)
    toast.success("Task added to this session")
    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add project task</DialogTitle>
          <DialogDescription>
            Create a focused next action. It will remain available for this
            browser session.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="task-title">Task name</Label>
            <Input
              id="task-title"
              autoFocus
              {...register("title")}
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title ? (
              <p className="text-destructive text-xs">{errors.title.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              rows={3}
              {...register("description")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                defaultValue="medium"
                onValueChange={(value) =>
                  setValue("priority", value as TaskFormValues["priority"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                defaultValue="todo"
                onValueChange={(value) =>
                  setValue("status", value as TaskFormValues["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="todo">To do</SelectItem>
                  <SelectItem value="in-progress">In progress</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="task-due">Due date</Label>
              <Input id="task-due" type="date" {...register("dueDate")} />
              {errors.dueDate ? (
                <p className="text-destructive text-xs">{errors.dueDate.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-estimate">Estimate (hours)</Label>
              <Input
                id="task-estimate"
                type="number"
                step="0.5"
                {...register("estimateHours")}
              />
              {errors.estimateHours ? (
                <p className="text-destructive text-xs">
                  {errors.estimateHours.message}
                </p>
              ) : null}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
