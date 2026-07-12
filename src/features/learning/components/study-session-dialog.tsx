import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { BookOpenCheck } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLearningStore } from "@/store/learning-store";
import { LEARNING_CATEGORIES } from "@/types/learning";

import {
  studySessionSchema,
  type StudySessionFormValues,
} from "../schemas/learning-schemas";

interface StudySessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudySessionDialog({
  open,
  onOpenChange,
}: StudySessionDialogProps) {
  const addStudySession = useLearningStore((state) => state.addStudySession);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudySessionFormValues>({
    resolver: zodResolver(studySessionSchema),
    defaultValues: {
      category: "Data Structures and Algorithms",
      topic: "",
      durationMinutes: 45,
      studiedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      focusScore: 8,
      notes: "",
    },
  });

  const onSubmit = (values: StudySessionFormValues) => {
    addStudySession({
      ...values,
      studiedAt: new Date(values.studiedAt).toISOString(),
      notes: values.notes || undefined,
    });
    toast.success("Study session logged", {
      description: `${values.durationMinutes} minutes added to this week.`,
    });
    reset({
      ...values,
      topic: "",
      notes: "",
      studiedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <BookOpenCheck aria-hidden="true" />
          Log study session
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Log a study session</DialogTitle>
          <DialogDescription>
            Capture what you worked on and how focused the session felt.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="study-category">Category</Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="study-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEARNING_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="study-topic">Topic</Label>
            <Input
              id="study-topic"
              placeholder="e.g. Graph traversal patterns"
              aria-invalid={Boolean(errors.topic)}
              aria-describedby={errors.topic ? "study-topic-error" : undefined}
              {...register("topic")}
            />
            {errors.topic && (
              <p id="study-topic-error" className="text-xs text-destructive">
                {errors.topic.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="study-duration">Duration (minutes)</Label>
              <Input
                id="study-duration"
                type="number"
                min={5}
                max={480}
                aria-invalid={Boolean(errors.durationMinutes)}
                {...register("durationMinutes")}
              />
              {errors.durationMinutes && (
                <p className="text-xs text-destructive">
                  {errors.durationMinutes.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="study-date">Date & time</Label>
              <Input
                id="study-date"
                type="datetime-local"
                aria-invalid={Boolean(errors.studiedAt)}
                {...register("studiedAt")}
              />
              {errors.studiedAt && (
                <p className="text-xs text-destructive">
                  {errors.studiedAt.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="study-focus">Focus score</Label>
            <Controller
              control={control}
              name="focusScore"
              render={({ field }) => (
                <Select
                  value={String(field.value)}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger id="study-focus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, index) => index + 1).map(
                      (score) => (
                        <SelectItem key={score} value={String(score)}>
                          {score}/10{score === 8 ? " · Strong focus" : ""}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="study-notes">
              Notes <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="study-notes"
              placeholder="What clicked? What should you revisit?"
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-xs text-destructive">{errors.notes.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Save session
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
