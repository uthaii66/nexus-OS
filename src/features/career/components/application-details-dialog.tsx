import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import {
  CalendarClock,
  FileText,
  Flag,
  MapPin,
  MessageSquarePlus,
  Pencil,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { useCareerStore } from "@/store/career-store";
import { APPLICATION_STAGES, type ApplicationStage } from "@/types/career";

import {
  applicationNoteSchema,
  type ApplicationNoteFormValues,
} from "../schemas/career-schemas";

interface ApplicationDetailsDialogProps {
  applicationId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (applicationId: string) => void;
}

export function ApplicationDetailsDialog({
  applicationId,
  open,
  onOpenChange,
  onEdit,
}: ApplicationDetailsDialogProps) {
  const application = useCareerStore((state) =>
    state.applications.find((candidate) => candidate.id === applicationId),
  );
  const resumeVersions = useCareerStore((state) => state.resumeVersions);
  const moveApplication = useCareerStore((state) => state.moveApplication);
  const setFollowUpDate = useCareerStore((state) => state.setFollowUpDate);
  const togglePriority = useCareerStore((state) => state.togglePriority);
  const associateResume = useCareerStore((state) => state.associateResume);
  const addApplicationNote = useCareerStore(
    (state) => state.addApplicationNote,
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationNoteFormValues>({
    resolver: zodResolver(applicationNoteSchema),
    defaultValues: { body: "" },
  });

  if (!application) return null;

  const onNoteSubmit = ({ body }: ApplicationNoteFormValues) => {
    addApplicationNote(application.id, body);
    reset();
    toast.success("Note added", {
      description: `Saved to ${application.company}.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="pr-8">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              tone={application.priority === "high" ? "warning" : "neutral"}
            >
              {application.priority === "high" ? "Priority" : application.stage}
            </StatusBadge>
            <span className="text-xs text-muted-foreground">
              Updated {format(parseISO(application.updatedAt), "MMM d")}
            </span>
          </div>
          <DialogTitle className="pt-1">{application.company}</DialogTitle>
          <DialogDescription>{application.role}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin aria-hidden="true" className="size-3.5" />
            {application.location} · {application.workMode}
          </span>
          {application.salaryRange && <span>{application.salaryRange}</span>}
          <span>{application.source}</span>
        </div>

        <div className="grid gap-4 rounded-2xl border border-border/70 bg-secondary/20 p-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="details-stage">Pipeline stage</Label>
            <Select
              value={application.stage}
              onValueChange={(value) =>
                moveApplication(application.id, value as ApplicationStage)
              }
            >
              <SelectTrigger id="details-stage">
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="details-follow-up">Follow-up date</Label>
            <Input
              id="details-follow-up"
              type="date"
              value={application.followUpDate ?? ""}
              onChange={(event) =>
                setFollowUpDate(application.id, event.target.value || undefined)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="details-resume">Resume version</Label>
            <Select
              value={application.resumeVersionId ?? "none"}
              onValueChange={(value) =>
                associateResume(
                  application.id,
                  value === "none" ? undefined : value,
                )
              }
            >
              <SelectTrigger id="details-resume">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No resume associated</SelectItem>
                {resumeVersions.map((resume) => (
                  <SelectItem key={resume.id} value={resume.id}>
                    {resume.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button
              type="button"
              variant={
                application.priority === "high" ? "secondary" : "outline"
              }
              className="w-full"
              onClick={() => togglePriority(application.id)}
            >
              <Flag
                aria-hidden="true"
                className={
                  application.priority === "high"
                    ? "fill-warning text-warning"
                    : ""
                }
              />
              {application.priority === "high"
                ? "Priority marked"
                : "Mark priority"}
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Detail
            label="Discovered"
            value={format(parseISO(application.discoveredAt), "MMM d, yyyy")}
          />
          <Detail
            label="Applied"
            value={
              application.appliedAt
                ? format(parseISO(application.appliedAt), "MMM d, yyyy")
                : "Not yet"
            }
          />
          <Detail
            label="Next action"
            value={
              application.followUpDate
                ? format(parseISO(application.followUpDate), "MMM d, yyyy")
                : "Not scheduled"
            }
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onEdit(application.id)}
          >
            <Pencil aria-hidden="true" />
            Edit details
          </Button>
        </div>

        <div className="border-t border-border/70 pt-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Notes</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Interview prep, recruiter context, and decisions.
              </p>
            </div>
            <StatusBadge tone="neutral">{application.notes.length}</StatusBadge>
          </div>

          <form
            className="space-y-2"
            onSubmit={handleSubmit(onNoteSubmit)}
            noValidate
          >
            <Label htmlFor="application-note" className="sr-only">
              Add a note
            </Label>
            <Textarea
              id="application-note"
              className="min-h-20"
              placeholder="Add a note or next preparation step…"
              aria-invalid={Boolean(errors.body)}
              {...register("body")}
            />
            <div className="flex items-center justify-between gap-3">
              {errors.body ? (
                <p className="text-xs text-destructive">
                  {errors.body.message}
                </p>
              ) : (
                <span />
              )}
              <Button type="submit" size="sm">
                <MessageSquarePlus aria-hidden="true" />
                Add note
              </Button>
            </div>
          </form>

          <div className="mt-4 max-h-56 space-y-2 overflow-y-auto pr-1">
            {application.notes.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-5 text-center text-xs text-muted-foreground">
                No notes yet. Add the next action or recruiter context above.
              </div>
            ) : (
              application.notes.map((note) => (
                <article
                  key={note.id}
                  className="rounded-xl border border-border/70 bg-secondary/20 p-3.5"
                >
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {note.body}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {format(parseISO(note.createdAt), "MMM d, yyyy · h:mm a")}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  const Icon = label === "Next action" ? CalendarClock : FileText;
  return (
    <div className="rounded-xl border border-border/60 bg-secondary/20 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon aria-hidden="true" className="size-3.5" />
        {label}
      </div>
      <p className="mt-1.5 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
