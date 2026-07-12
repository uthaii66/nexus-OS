import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={350}>
        <div className="dark">{children}</div>
        <Toaster
          theme="dark"
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast:
                "!rounded-xl !border-white/10 !bg-popover !text-foreground !shadow-float",
              description: "!text-muted-foreground",
            },
          }}
        />
      </TooltipProvider>
    </MotionConfig>
  );
}
