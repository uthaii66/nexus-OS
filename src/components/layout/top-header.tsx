import { useState } from "react"
import { format } from "date-fns"
import { Bell, CheckCheck, Command, Menu, Plus, Settings } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { BrandMark } from "@/components/brand/brand-mark"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { navigationItems } from "@/components/navigation/nav-items"
import { useUiStore } from "@/store/ui-store"

const initialNotifications = [
  { id: "bill", title: "Barclaycard payment due", detail: "£184.20 is due on 16 July", tone: "bg-amber-300" },
  { id: "career", title: "Follow-up window reached", detail: "Capital One and Vanguard applications", tone: "bg-indigo-300" },
  { id: "project", title: "Project task is blocked", detail: "Terra-Zone deployment checklist", tone: "bg-red-300" },
]

export function TopHeader() {
  const location = useLocation()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(initialNotifications)
  const setMobileNavigationOpen = useUiStore((state) => state.setMobileNavigationOpen)
  const setCommandPaletteOpen = useUiStore((state) => state.setCommandPaletteOpen)
  const openQuickAdd = useUiStore((state) => state.openQuickAdd)
  const current = navigationItems.find((item) => item.path !== "/" && location.pathname.startsWith(item.path)) ?? navigationItems[0]
  return <header className="sticky top-0 z-30 flex h-[68px] items-center border-b border-white/[0.055] bg-background/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8"><div className="flex min-w-0 flex-1 items-center gap-3"><Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileNavigationOpen(true)} aria-label="Open navigation"><Menu /></Button><BrandMark className="sm:hidden" compact /><div className="hidden sm:block"><p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Workspace</p><p className="mt-0.5 text-sm font-medium">{current?.label ?? "Overview"}</p></div></div><div className="flex items-center gap-1.5 sm:gap-2"><Button variant="outline" className="hidden h-9 min-w-52 justify-between text-muted-foreground md:flex" onClick={() => setCommandPaletteOpen(true)}><span className="flex items-center gap-2"><Command className="size-4" />Search or run a command</span><kbd className="rounded-md border border-border bg-secondary px-1.5 py-0.5 font-sans text-[10px]">⌘ K</kbd></Button><Button variant="ghost" size="icon" className="md:hidden" onClick={() => setCommandPaletteOpen(true)} aria-label="Open command palette"><Command /></Button><Popover><PopoverTrigger asChild><Button variant="ghost" size="icon" className="relative" aria-label={`${notifications.length} unread notifications`}><Bell />{notifications.length ? <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary ring-2 ring-background" /> : null}</Button></PopoverTrigger><PopoverContent align="end" className="w-[min(24rem,calc(100vw-2rem))] p-0"><div className="flex items-center justify-between border-b border-border p-4"><div><p className="text-sm font-semibold">Notifications</p><p className="mt-0.5 text-xs text-muted-foreground">{notifications.length ? `${notifications.length} items need attention` : "You're all caught up"}</p></div>{notifications.length ? <Button variant="ghost" size="sm" onClick={() => setNotifications([])}><CheckCheck />Mark all read</Button> : null}</div><div className="max-h-80 overflow-y-auto p-2">{notifications.length ? notifications.map((item) => <button key={item.id} className="flex w-full items-start gap-3 rounded-xl p-3 text-left hover:bg-secondary/70" onClick={() => setNotifications((items) => items.filter((entry) => entry.id !== item.id))}><span className={`mt-1.5 size-2 shrink-0 rounded-full ${item.tone}`} /><span><span className="block text-sm font-medium">{item.title}</span><span className="mt-1 block text-xs text-muted-foreground">{item.detail}</span></span></button>) : <div className="px-4 py-10 text-center text-sm text-muted-foreground">No new notifications.</div>}</div></PopoverContent></Popover><Button className="hidden sm:flex" size="sm" onClick={() => openQuickAdd({ source: "button" })}><Plus />Add</Button><Popover><PopoverTrigger asChild><button className="ml-1 flex size-9 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-indigo-400 to-indigo-700 font-display text-xs font-bold text-white shadow-sm" aria-label="Open profile menu">UK</button></PopoverTrigger><PopoverContent align="end" className="w-64"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 font-display text-sm font-bold text-indigo-200">UK</span><div><p className="text-sm font-semibold">Uthai Kumar</p><p className="text-xs text-muted-foreground">{format(new Date(), "EEEE, d MMMM")}</p></div></div><Button variant="ghost" className="mt-3 w-full justify-start" onClick={() => navigate("/settings")}><Settings />Workspace settings</Button></PopoverContent></Popover></div></header>
}
