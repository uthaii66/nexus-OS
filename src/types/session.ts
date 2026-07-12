import type { QuickAddAction } from "@/types/quick-add"

export type SessionEntryValue = string | number | boolean | undefined
export interface SessionEntry {
  id: string
  action: QuickAddAction
  createdAt: string
  payload: Record<string, SessionEntryValue>
}
