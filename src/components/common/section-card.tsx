import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: SectionCardProps) {
  const hasHeader = title || description || action;
  return (
    <Card className={cn("overflow-hidden", className)}>
      {hasHeader ? (
        <CardHeader className="flex-row items-start justify-between space-y-0 border-b border-border/55 pb-4">
          <div className="min-w-0 space-y-1">
            {title ? <CardTitle>{title}</CardTitle> : null}
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </CardHeader>
      ) : null}
      <CardContent
        className={cn(
          hasHeader ? "pt-5 sm:pt-6" : "pt-5 sm:pt-6",
          contentClassName,
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}
