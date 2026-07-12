import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { useProjectsStore } from "@/store/projects-store";

const noteSchema = z.object({
  kind: z.enum(["note", "decision"]),
  title: z.string().trim().min(3, "Add a clear title.").max(80),
  content: z.string().trim().min(8, "Add a little more context.").max(600),
});

type NoteFormValues = z.infer<typeof noteSchema>;

export function AddNoteDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const addNote = useProjectsStore((state) => state.addNote);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: { kind: "note", title: "", content: "" },
  });

  const onSubmit = (values: NoteFormValues) => {
    addNote({ projectId, ...values });
    toast.success(
      values.kind === "decision" ? "Decision recorded" : "Note added",
    );
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <FilePlus2 /> Add note
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Capture project context</DialogTitle>
          <DialogDescription>
            Record a working note or preserve an important decision for this
            session.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              defaultValue="note"
              onValueChange={(value) =>
                setValue("kind", value as NoteFormValues["kind"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="note">Working note</SelectItem>
                <SelectItem value="decision">Decision</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="note-title">Title</Label>
            <Input
              id="note-title"
              {...register("title")}
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title ? (
              <p className="text-destructive text-xs">{errors.title.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="note-content">Context</Label>
            <Textarea
              id="note-content"
              rows={5}
              {...register("content")}
              aria-invalid={Boolean(errors.content)}
            />
            {errors.content ? (
              <p className="text-destructive text-xs">
                {errors.content.message}
              </p>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
