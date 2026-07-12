import { cn } from "@/lib/utils"

interface BrandMarkProps { className?: string; compact?: boolean }
export function BrandMark({ className, compact }: BrandMarkProps) {
  return <div className={cn("flex items-center gap-3", className)}><svg viewBox="0 0 40 40" className="size-9 shrink-0" role="img" aria-label="Uthai Nexus"><defs><linearGradient id="nexus-mark" x1="7" y1="6" x2="34" y2="35" gradientUnits="userSpaceOnUse"><stop stopColor="#9CA8FF" /><stop offset="1" stopColor="#6475EE" /></linearGradient></defs><rect x="1" y="1" width="38" height="38" rx="12" fill="#171A24" stroke="rgba(255,255,255,.09)" /><path d="M11 28V12l18 16V12" fill="none" stroke="url(#nexus-mark)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="11" cy="12" r="2.25" fill="#AAB3FF" /><circle cx="29" cy="12" r="2.25" fill="#7585F5" /><circle cx="29" cy="28" r="2.25" fill="#7585F5" /></svg>{compact ? null : <div className="min-w-0"><p className="font-display text-sm font-bold tracking-[-0.02em]">Uthai Nexus</p><p className="mt-0.5 truncate text-[10px] text-muted-foreground">Personal command center</p></div>}</div>
}
