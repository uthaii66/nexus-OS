import { motion, useReducedMotion } from "framer-motion"
import { NavLink } from "react-router-dom"
import { ChevronsLeft, ChevronsRight, Plus } from "lucide-react"
import { BrandMark } from "@/components/brand/brand-mark"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { navigationItems } from "@/components/navigation/nav-items"
import { useUiStore } from "@/store/ui-store"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const collapsed = useUiStore((state) => state.sidebarCollapsed)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const openQuickAdd = useUiStore((state) => state.openQuickAdd)
  const reduced = useReducedMotion()
  return <motion.aside initial={false} animate={{ width: collapsed ? 84 : 252 }} transition={{ duration: reduced ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-y-0 left-0 z-40 hidden border-r border-white/[0.06] bg-[#0d0f15]/95 px-3 py-4 backdrop-blur-xl lg:flex lg:flex-col"><div className={cn("flex h-12 items-center", collapsed ? "justify-center" : "px-2")}><BrandMark compact={collapsed} /></div><Button className={cn("mt-5 w-full", collapsed && "px-0")} onClick={() => openQuickAdd({ source: "button" })} aria-label="Quick add"> <Plus />{collapsed ? null : "Quick add"}</Button><nav className="mt-6 flex-1 space-y-1" aria-label="Primary navigation">{navigationItems.map((item) => { const Icon = item.icon; const link = <NavLink to={item.path} end={item.path === "/"} className={({ isActive }) => cn("relative flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground", collapsed && "justify-center px-0", isActive && "bg-primary/10 text-indigo-200 before:absolute before:left-0 before:h-5 before:w-0.5 before:rounded-full before:bg-primary")}><Icon className="size-[18px] shrink-0" />{collapsed ? null : <span>{item.label}</span>}</NavLink>; return collapsed ? <Tooltip key={item.path}><TooltipTrigger asChild>{link}</TooltipTrigger><TooltipContent side="right">{item.label}</TooltipContent></Tooltip> : <div key={item.path}>{link}</div> })}</nav><div className="border-t border-border/70 pt-3"><Button variant="ghost" size={collapsed ? "icon" : "default"} className={cn("w-full text-muted-foreground", !collapsed && "justify-start")} onClick={toggleSidebar} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? <ChevronsRight /> : <><ChevronsLeft /><span>Collapse sidebar</span></>}</Button></div></motion.aside>
}
