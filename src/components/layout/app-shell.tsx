import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Outlet, useLocation } from "react-router-dom"
import { Plus } from "lucide-react"
import { Sidebar } from "@/components/navigation/sidebar"
import { MobileNavigation } from "@/components/navigation/mobile-navigation"
import { TopHeader } from "@/components/layout/top-header"
import { Button } from "@/components/ui/button"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useUiStore } from "@/store/ui-store"
import { QuickAddModal } from "@/features/quick-add/components/quick-add-modal"
import { CommandPalette } from "@/features/command/components/command-palette"

export function AppShell() {
  const location = useLocation()
  const collapsed = useUiStore((state) => state.sidebarCollapsed)
  const compact = useUiStore((state) => state.compactMode)
  const openQuickAdd = useUiStore((state) => state.openQuickAdd)
  const reduced = useReducedMotion()
  useKeyboardShortcuts()
  return <div className="min-h-screen"><Sidebar /><motion.div initial={false} animate={{ marginLeft: collapsed ? 84 : 252 }} transition={{ duration: reduced ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }} className="min-h-screen max-lg:!ml-0"><TopHeader /><main className={compact ? "mx-auto w-full max-w-[1600px] px-4 py-5 pb-28 sm:px-6 lg:px-7 lg:py-6" : "mx-auto w-full max-w-[1600px] px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:py-8"}><AnimatePresence mode="wait" initial={false}><motion.div key={location.pathname} initial={reduced ? false : { opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -4 }} transition={{ duration: reduced ? 0 : 0.2 }}><Outlet /></motion.div></AnimatePresence></main></motion.div><Button className="fixed bottom-6 right-6 z-30 hidden h-11 rounded-full px-5 shadow-float lg:flex" onClick={() => openQuickAdd({ source: "button" })}><Plus />Quick add</Button><MobileNavigation /><QuickAddModal /><CommandPalette /></div>
}
