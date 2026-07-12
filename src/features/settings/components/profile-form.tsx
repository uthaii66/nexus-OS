import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/store/settings-store";

const profileSchema = z.object({
  displayName: z.string().trim().min(2, "Enter at least 2 characters.").max(50),
  email: z.string().trim().email("Enter a valid email address.").max(100),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const displayName = useSettingsStore((state) => state.displayName);
  const email = useSettingsStore((state) => state.email);
  const updateProfile = useSettingsStore((state) => state.updateProfile);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName, email },
  });

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile(values);
    toast.success("Profile preferences saved");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 sm:grid-cols-[auto_1fr_1fr_auto] sm:items-end"
      noValidate
    >
      <div
        className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 font-display text-lg font-semibold text-primary ring-1 ring-primary/20"
        aria-label="Profile initials"
      >
        {displayName
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </div>
      <div className="space-y-2">
        <Label htmlFor="display-name">Display name</Label>
        <Input
          id="display-name"
          {...register("displayName")}
          aria-invalid={Boolean(errors.displayName)}
        />
        {errors.displayName ? (
          <p className="text-destructive text-xs">
            {errors.displayName.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="profile-email">Email label</Label>
        <Input
          id="profile-email"
          type="email"
          {...register("email")}
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email ? (
          <p className="text-destructive text-xs">{errors.email.message}</p>
        ) : null}
      </div>
      <Button type="submit" variant="outline" disabled={!isDirty}>
        <Save /> Save
      </Button>
    </form>
  );
}
