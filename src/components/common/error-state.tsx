import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}
export function ErrorState({
  title = "Something went off course",
  description = "This view could not be loaded. Your session data is still safe.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-red-300">
        <AlertTriangle />
      </span>
      <h2 className="mt-5 font-display text-xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {onRetry ? (
        <Button variant="outline" className="mt-5" onClick={onRetry}>
          <RotateCcw />
          Try again
        </Button>
      ) : null}
    </div>
  );
}
