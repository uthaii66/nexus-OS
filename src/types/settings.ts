export type ThemePreference = "dark" | "system"
export type SidebarPreference = "expanded" | "collapsed" | "remember"
export type CurrencyPreference = "USD" | "INR" | "EUR" | "GBP"
export type WeightUnit = "kg" | "lb"
export type DateFormatPreference = "MMM d, yyyy" | "dd/MM/yyyy" | "MM/dd/yyyy"

export type DashboardWidgetId =
  | "todayFocus"
  | "lifeScore"
  | "dailySummary"
  | "schedule"
  | "alerts"
  | "weeklyProgress"
  | "recentActivity"

export interface NotificationPreferences {
  reminders: boolean
  financeAlerts: boolean
  healthNudges: boolean
  careerFollowUps: boolean
  weeklyDigest: boolean
}

export interface SettingsPreferences {
  displayName: string
  email: string
  theme: ThemePreference
  sidebar: SidebarPreference
  reducedMotion: boolean
  currency: CurrencyPreference
  weightUnit: WeightUnit
  dateFormat: DateFormatPreference
  dashboardWidgets: Record<DashboardWidgetId, boolean>
  notifications: NotificationPreferences
}

export interface SettingsActions {
  updateProfile: (
    input: Pick<SettingsPreferences, "displayName" | "email">,
  ) => void
  setPreference: <K extends keyof SettingsPreferences>(
    key: K,
    value: SettingsPreferences[K],
  ) => void
  setNotification: (key: keyof NotificationPreferences, value: boolean) => void
  setWidgetVisibility: (widget: DashboardWidgetId, visible: boolean) => void
  resetPreferences: () => void
}
