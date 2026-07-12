import { ArrowLeft, Compass } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  const navigate = useNavigate()
  return <div className="flex min-h-[65vh] flex-col items-center justify-center text-center"><span className="flex size-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-indigo-300"><Compass className="size-6" /></span><p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary">404 · Off the map</p><h1 className="mt-3 font-display text-3xl font-bold tracking-tight">That Nexus route doesn’t exist.</h1><p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">The page may have moved, or the link points to a future module that isn’t part of Phase 1.</p><Button className="mt-6" onClick={() => navigate("/")}><ArrowLeft />Back to overview</Button></div>
}

export default NotFoundPage
