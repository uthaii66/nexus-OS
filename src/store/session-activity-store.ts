import { create } from "zustand"
import type { SessionEntry } from "@/types/session"

interface SessionActivityStore {
  entries: SessionEntry[]
  addEntry: (entry: SessionEntry) => void
  removeEntry: (id: string) => void
}

export const useSessionActivityStore = create<SessionActivityStore>((set) => ({
  entries: [],
  addEntry: (entry) => set((state) => ({ entries: [entry, ...state.entries] })),
  removeEntry: (id) => set((state) => ({ entries: state.entries.filter((entry) => entry.id !== id) })),
}))
