import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { QuickAddAction, QuickAddRequest } from "@/types/quick-add"

interface UiStore {
  sidebarCollapsed: boolean
  mobileNavigationOpen: boolean
  commandPaletteOpen: boolean
  quickAddOpen: boolean
  quickAddAction?: QuickAddAction
  compactMode: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setMobileNavigationOpen: (open: boolean) => void
  setCommandPaletteOpen: (open: boolean) => void
  openQuickAdd: (request?: QuickAddRequest) => void
  closeQuickAdd: () => void
  setQuickAddAction: (action?: QuickAddAction) => void
  toggleCompactMode: () => void
  setCompactMode: (compact: boolean) => void
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileNavigationOpen: false,
      commandPaletteOpen: false,
      quickAddOpen: false,
      quickAddAction: undefined,
      compactMode: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setMobileNavigationOpen: (mobileNavigationOpen) => set({ mobileNavigationOpen }),
      setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
      openQuickAdd: (request) => set({ quickAddOpen: true, quickAddAction: request?.action }),
      closeQuickAdd: () => set({ quickAddOpen: false, quickAddAction: undefined }),
      setQuickAddAction: (quickAddAction) => set({ quickAddAction }),
      toggleCompactMode: () => set((state) => ({ compactMode: !state.compactMode })),
      setCompactMode: (compactMode) => set({ compactMode }),
    }),
    {
      name: "uthai-nexus-ui",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        compactMode: state.compactMode,
      }),
    },
  ),
)
