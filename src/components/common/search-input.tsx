import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchInputProps { value: string; onChange: (value: string) => void; placeholder?: string; className?: string }
export function SearchInput({ value, onChange, placeholder = "Search…", className }: SearchInputProps) {
  return <div className={cn("relative min-w-0", className)}><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="pl-9 pr-9" aria-label={placeholder} />{value ? <Button type="button" variant="ghost" size="icon-sm" onClick={() => onChange("")} className="absolute right-1 top-1 text-muted-foreground" aria-label="Clear search"><X /></Button> : null}</div>
}
