import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  DashboardWidgetId,
  NotificationPreferences,
  SettingsActions,
  SettingsPreferences,
} from "@/types/settings";

export const defaultSettings: SettingsPreferences = {
  displayName: "Uthai Kumar",
  email: "uthai@example.com",
  theme: "dark",
  sidebar: "remember",
  reducedMotion: false,
  currency: "INR",
  weightUnit: "kg",
  dateFormat: "MMM d, yyyy",
  dashboardWidgets: {
    todayFocus: true,
    lifeScore: true,
    dailySummary: true,
    schedule: true,
    alerts: true,
    weeklyProgress: true,
    recentActivity: true,
  },
  notifications: {
    reminders: true,
    financeAlerts: true,
    healthNudges: true,
    careerFollowUps: true,
    weeklyDigest: false,
  },
};

export type SettingsStore = SettingsPreferences & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      updateProfile: (input) => set(input),
      setPreference: (key, value) =>
        set(() => ({ [key]: value }) as Partial<SettingsStore>),
      setNotification: (key: keyof NotificationPreferences, value: boolean) =>
        set((state) => ({
          notifications: { ...state.notifications, [key]: value },
        })),
      setWidgetVisibility: (widget: DashboardWidgetId, visible: boolean) =>
        set((state) => ({
          dashboardWidgets: { ...state.dashboardWidgets, [widget]: visible },
        })),
      resetPreferences: () => set(defaultSettings),
    }),
    {
      name: "uthai-nexus-preferences",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        displayName: state.displayName,
        email: state.email,
        theme: state.theme,
        sidebar: state.sidebar,
        reducedMotion: state.reducedMotion,
        currency: state.currency,
        weightUnit: state.weightUnit,
        dateFormat: state.dateFormat,
        dashboardWidgets: state.dashboardWidgets,
        notifications: state.notifications,
      }),
    },
  ),
);
