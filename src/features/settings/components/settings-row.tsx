import type { ReactNode } from "react"

interface SettingsRowProps {
  title: string
  description: string
  control: ReactNode
  htmlFor?: string
}

export function SettingsRow({
  title,
  description,
  control,
  htmlFor,
}: SettingsRowProps) {
  const content = (
    <span className="min-w-0 flex-1">
      <span className="block text-sm font-medium text-foreground">{title}</span>
      <span className="mt-1 block text-xs leading-5 text-muted-foreground">
        {description}
      </span>
    </span>
  )

  return (
    <div className="flex items-center gap-4 border-b border-border/60 py-4 last:border-b-0">
      {htmlFor ? (
        <label htmlFor={htmlFor} className="min-w-0 flex-1 cursor-pointer">
          {content}
        </label>
      ) : (
        content
      )}
      <div className="shrink-0">{control}</div>
    </div>
  )
}
